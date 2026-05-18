import { RidesRepository } from "../repositories/rides.repository.js";
import { LatLng } from "../models/base.model.js";
import { MapService } from "./mapbox.service.js";
import { MeetingPointSuggestion, PickupMode, Ride, RideDto, Route, SearchRide } from "../models/ride.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { RideRole, RidesHistory, RideStatus } from "../models/rides-history.model.js";
import { RidesHistoryService } from "./rides-history.service.js";
import { Timestamp } from "firebase-admin/firestore";
import { UserRepository } from "../repositories/user.repository.js";
import { NotificationsService } from "./notifications.service.js";
import type { PassengerPickup } from "../models/ride.model.js";

const MEET_THRESHOLD_METERS = Number(process.env.MEET_THRESHOLD_METERS || 3000);
const DRIVER_CHANGE_THRESHOLD_HOURS = 8;
const DRIVER_CHANGE_THRESHOLD_MS = DRIVER_CHANGE_THRESHOLD_HOURS * 60 * 60 * 1000;

export class RidesService {

  constructor(
    private ridesHistoryService = new RidesHistoryService(),
    private ridesRepository = new RidesRepository(),
    private userRepository = new UserRepository(),
  ) {
    this.mapboxService = new MapService();
  }

  private mapboxService: MapService;

  public async checkAndCompleteExpiredRides(): Promise<void> {
    const rides = await this.ridesRepository.getAll();
    const now = new Date();

    for (const ride of rides) {
      // Converts Timestamp to Date
      const dateObj = ride.date.toDate();
      const dateString = dateObj.toISOString().split('T')[0];

      const rideDateTime = new Date(`${dateString}T${ride.endTime}`);

      if (ride.isActive && rideDateTime <= now) {
        try {
          ride.isActive = false;
          ride.updatedAt = new Date();
          await this.ridesRepository.update(ride.id, ride);

          await this.ridesHistoryService.completeRideHistories(ride.id);
        } catch (err) {
          console.error(`Erro ao completar ride ${ride.id}:`, err);
        }
      }
    }
  }

  public async getAll(): Promise<RideDto[]> {
    const rides = await this.ridesRepository.getAll();

    const filteredRides = rides.filter(ride => ride.isActive === true  && ride.availableSeats > 0);
    
    return filteredRides.map(ride => this.formatRideForFrontend(ride));
  }

  public async getById(id: string): Promise<RideDto> {
    const ride = await this.getByIdInternal(id);

    return this.formatRideForFrontend(ride);
  }

  public async create(ride: Ride, userId: string): Promise<void> {
    if (!userId) {
      throw new ValidationError("Usuário não autenticado para criar a corrida.");
    }

    const driver = await this.userRepository.getById(userId);
    const hasCarInfo = Boolean(driver?.carInfo?.trim());
    const driverCarSeats = Number(driver?.carSeats ?? 0);

    if (!driver?.hasCar || !hasCarInfo || driverCarSeats < 2) {
      throw new ValidationError("Cadastre um veículo no perfil para criar corridas.");
    }

    // carSeats = lugares totais (inclui motorista); allSeats = vagas para passageiros na corrida
    const maxPassengerSeats = Math.max(1, driverCarSeats - 1);
    if (ride.allSeats > maxPassengerSeats) {
      throw new ValidationError(
        `Seu veículo tem ${driverCarSeats} lugares no total (incluindo o motorista). Você pode oferecer no máximo ${maxPassengerSeats} vaga(s) para passageiros.`
      );
    }

    ride.driverId = userId;
    ride.availableSeats = ride.allSeats;
    ride.createdAt = new Date();
    ride.pickupMode = ride.pickupMode || "meeting_point";
    ride.meetingPoint = ride.pickupMode === "meeting_point" ? (ride.meetingPoint || null) : null;
  
    if (ride.date instanceof Date || typeof ride.date === 'string') {
      ride.date = this.convertDateToTimestamp(ride.date as Date | string);
    }
    const _ride = await this.ridesRepository.create(ride);

    const payload = {
      ride: _ride,
      rideId: _ride.id,
      status: RideStatus.PENDING,
      isActive: true,
      role: RideRole.DRIVER,
      userId: userId
    } as RidesHistory;

    await this.ridesHistoryService.create(payload);
  }

  public async update(id: string, ride: Ride): Promise<void> {
    const _ride = await this.getByIdInternal(id);
    this.ensureDriverCanModifyRide(_ride);
    
    _ride.updatedAt = new Date();
    _ride.isActive = ride.isActive;
    _ride.driverId = ride.driverId;
    _ride.departureLatLng = ride.departureLatLng;
    _ride.destinationLatLng = ride.destinationLatLng;
    
    if (ride.date instanceof Date || typeof ride.date === 'string') {
      _ride.date = this.convertDateToTimestamp(ride.date as Date | string);
    } else {
      _ride.date = ride.date;
    }
    _ride.startTime = ride.startTime;
    _ride.endTime = ride.endTime;
    _ride.allSeats = ride.allSeats;
    _ride.availableSeats = ride.availableSeats;
    _ride.pricePerPassenger = ride.pricePerPassenger;
    _ride.passengerIds = ride.passengerIds;
    _ride.pickupMode = ride.pickupMode || _ride.pickupMode || "meeting_point";
    _ride.meetingPoint = _ride.pickupMode === "meeting_point"
      ? (ride.meetingPoint || _ride.meetingPoint || null)
      : null;
        
    await this.ridesRepository.update(id, _ride);
  }

  public async updatePickupPlan(rideId: string, userId: string, pickupMode: PickupMode, meetingPoint: Route | null): Promise<void> {
    const ride = await this.getByIdInternal(rideId);
    this.ensureDriverCanModifyRide(ride);

    if (ride.driverId !== userId) {
      throw new ValidationError("Apenas o motorista pode alterar o plano de embarque.");
    }

    ride.updatedAt = new Date();
    ride.pickupMode = pickupMode;
    ride.meetingPoint = pickupMode === "meeting_point" ? (meetingPoint || null) : null;
    ride.pickupPlanConfigured = true;

    await this.ridesRepository.update(rideId, ride);

    const passengerIds = [...new Set(ride.passengerIds || [])];
    const notifications = new NotificationsService();
    const embarkLabel = pickupMode === "street_by_street"
      ? "O motorista passará na sua rua."
      : meetingPoint
        ? `Ponto de encontro: ${meetingPoint.street}, ${meetingPoint.city}.`
        : "O plano de embarque foi atualizado.";

    await Promise.all(
      passengerIds.map((passengerId) =>
        notifications.notifyUser(
          passengerId,
          "Plano de embarque definido",
          embarkLabel,
          "pickup",
          rideId
        )
      )
    );
  }

  public async suggestMeetingPoints(rideId: string, userId: string): Promise<MeetingPointSuggestion[]> {
    const ride = await this.getByIdInternal(rideId);
    if (ride.driverId !== userId) {
      throw new ValidationError("Apenas o motorista pode sugerir pontos de encontro.");
    }

    const passengerPickups = Array.isArray(ride.passengerPickups) ? ride.passengerPickups : [];
    if (passengerPickups.length === 0) {
      throw new ValidationError("Ainda não há passageiros para sugerir pontos de encontro.");
    }

    const passengerPoints = await this.resolvePassengerPointsFromPickups(passengerPickups);

    if (passengerPoints.length === 0) {
      throw new ValidationError("Não foi possível localizar os endereços usados pelos passageiros na busca.");
    }

    const uniquePassengerPoints: LatLng[] = [];
    const pointSet = new Set<string>();
    for (const [lat, lng] of passengerPoints) {
      const key = `${lat.toFixed(6)}:${lng.toFixed(6)}`;
      if (!pointSet.has(key)) {
        pointSet.add(key);
        uniquePassengerPoints.push([lat, lng]);
      }
    }

    const centroid = this.getCentroid([ride.departureLatLng, ...uniquePassengerPoints]);
    const candidates: LatLng[] = [centroid, ride.departureLatLng];
    if (ride.destinationLatLng) {
      candidates.push(this.getCentroid([centroid, ride.destinationLatLng]));
    }

    const suggestions: MeetingPointSuggestion[] = [];
    const seen = new Set<string>();
    for (const candidate of candidates) {
      const routePoint = await this.reverseToRoute(candidate);
      const dedupeKey = `${routePoint.street}|${routePoint.city}|${routePoint.state}`.toLowerCase();
      if (seen.has(dedupeKey)) {
        continue;
      }
      seen.add(dedupeKey);

      const score = uniquePassengerPoints.reduce((acc, point) => acc + this.haversineMeters(candidate, point), 0);
      suggestions.push({
        ...routePoint,
        score,
        reason: "Ponto sugerido com menor deslocamento total dos passageiros.",
      });
    }

    return suggestions.sort((a, b) => a.score - b.score).slice(0, 3);
  }

  public async getRidePickupContext(rideId: string, userId: string): Promise<{
    ride: RideDto;
    passengerPickups: Array<{ userId: string; address: string; lat: number; long: number }>;
  }> {
    const ride = await this.getByIdInternal(rideId);
    if (ride.driverId !== userId) {
      throw new ValidationError("Apenas o motorista pode visualizar o planejamento de embarque.");
    }

    const passengerPickups = await this.enrichPassengerPickups(ride.passengerPickups || []);

    return {
      ride: this.formatRideForFrontend(ride),
      passengerPickups,
    };
  }

  public async chooseRide(
    userId: string,
    rideId: string,
    seatsRequested = 1,
    pickupAddress = "",
    pickupLatLng: number[] | null = null,
  ): Promise<void> {
    const ride = await this.getByIdInternal(rideId);

    if (!Number.isInteger(seatsRequested) || seatsRequested < 1) {
      throw new ValidationError("Quantidade de assentos inválida para reserva.");
    }

    if (ride.availableSeats < seatsRequested) {
      throw new ValidationError("Não há assentos suficientes disponíveis para esta reserva.");
    }

    ride.updatedAt = new Date();
    ride.availableSeats = ride.availableSeats - seatsRequested;
    if (!ride.passengerIds) {
      ride.passengerIds = [];
    }
    for (let i = 0; i < seatsRequested; i += 1) {
      ride.passengerIds.push(userId);
    }

    if (!ride.passengerPickups) {
      ride.passengerPickups = [];
    }

    const normalizedPickupAddress = pickupAddress.trim();
    const coords = await this.resolvePickupCoordinates(normalizedPickupAddress, pickupLatLng);

    const passengerPickup = {
      userId,
      address: normalizedPickupAddress,
      lat: coords.lat,
      long: coords.long,
    };
    const existingPickupIndex = ride.passengerPickups.findIndex((pickup) => pickup.userId === userId);
    if (existingPickupIndex >= 0) {
      ride.passengerPickups[existingPickupIndex] = passengerPickup;
    } else {
      ride.passengerPickups.push(passengerPickup);
    }
        
    await this.ridesRepository.update(rideId, ride);

    const payload = {
      ride,
      rideId: ride.id,
      status: RideStatus.PENDING,
      isActive: true,
      role: RideRole.PASSENGER,
      userId: userId
    } as RidesHistory;

    await this.ridesHistoryService.create(payload);

    await new NotificationsService().notifyUser(
      ride.driverId,
      "Nova reserva",
      "Um passageiro reservou assentos na sua corrida.",
      "ride",
      rideId
    );
  }

  public async cancelRide(userId: string, rideId: string): Promise<void> {
    const ride = await this.getByIdInternal(rideId);
    const reservedSeats = ride.passengerIds?.filter(id => id === userId).length ?? 0;

    if (reservedSeats <= 0) {
      throw new ValidationError("Nenhuma reserva ativa encontrada para este usuário.");
    }

    ride.updatedAt = new Date();
    ride.availableSeats = Math.min(ride.allSeats, ride.availableSeats + reservedSeats);
    ride.passengerIds = ride.passengerIds?.filter(id => id !== userId);
    ride.passengerPickups = ride.passengerPickups?.filter((pickup) => pickup.userId !== userId);
        
    await this.ridesRepository.update(rideId, ride);
    await this.ridesHistoryService.cancelUserRide(rideId, userId);
  }

  public async driverCancelRide(userId: string, rideId: string): Promise<void> {
    const ride = await this.getByIdInternal(rideId);
    this.ensureDriverCanModifyRide(ride);

    if (ride.driverId !== userId) {
      throw new ValidationError("Apenas o motorista pode cancelar a corrida.");
    }

    ride.updatedAt = new Date();
    ride.availableSeats = ride.allSeats;
    ride.isActive = false;
    ride.passengerIds = [];
    ride.passengerPickups = [];
        
    await this.ridesRepository.update(rideId, ride);
    await this.ridesHistoryService.cancelDriverRide(rideId);
  }

  public async suggestRides(search: SearchRide): Promise<Array<RideDto & { extraMeters: number }>> {
    if (!search.departureLatLng || !search.destinationLatLng) {
      throw new Error("Origem e destino são obrigatórios!");
    }

    const now = new Date();
    const allRides = await this.ridesRepository.getAll();
    const minimumAvailableSeats = search.minimumAvailableSeats && search.minimumAvailableSeats > 0
      ? search.minimumAvailableSeats
      : 1;
    const searchDate = search.date ? new Date(search.date) : null;
    const hasValidSearchDate = Boolean(searchDate && !Number.isNaN(searchDate.getTime()));
    const normalizedSearchDate = hasValidSearchDate
      ? `${searchDate!.getUTCFullYear()}-${String(searchDate!.getUTCMonth() + 1).padStart(2, "0")}-${String(searchDate!.getUTCDate()).padStart(2, "0")}`
      : null;
    const activeRides = allRides.filter(ride => ride.isActive === true && ride.availableSeats >= minimumAvailableSeats);
    const matches: Array<RideDto & { extraMeters: number }> = [];

    for (const ride of activeRides) {
      if (search.userId && (ride.driverId === search.userId || ride.passengerIds?.includes(search.userId))) {
        continue;
      }

      const dateObj = ride.date.toDate();
      const dateString = dateObj.toISOString().split('T')[0];
      if (normalizedSearchDate && dateString !== normalizedSearchDate) {
        continue;
      }

      const rideDateTime = new Date(`${dateString}T${ride.startTime}`);
      
      if (rideDateTime <= now) continue;
  
      const driverOrigin: LatLng = ride.departureLatLng;
      const driverDestination: LatLng = ride.destinationLatLng;

      // Driver original route
      const origCoords = `${driverOrigin[1]},${driverOrigin[0]};${driverDestination[1]},${driverDestination[0]}`;
      const origDir = await this.mapboxService.getDirections(origCoords, "driving");
      const origDistance = origDir.routes?.[0]?.distance ?? Infinity;

      // Passanger pickup point route
      const withPickupCoords = `${driverOrigin[1]},${driverOrigin[0]};${search.departureLatLng[1]},${search.departureLatLng[0]};${driverDestination[1]},${driverDestination[0]}`;
      const withPickupDir = await this.mapboxService.getDirections(withPickupCoords, "driving");
      const withPickupDistance = withPickupDir.routes?.[0]?.distance ?? Infinity;

      const extra = withPickupDistance - origDistance;

      if (extra <= MEET_THRESHOLD_METERS) {
        const formattedRide = this.formatRideForFrontend(ride);
        matches.push({
          ...formattedRide,
          extraMeters: extra,
        });
      }
    }

    // Order by distance
    matches.sort((a, b) => a.extraMeters - b.extraMeters);

    return matches;
  }

  private getRideStartDateTime(ride: Ride): Date {
    const rideDate = ride.date.toDate();
    const [hoursStr, minutesStr = "0"] = ride.startTime.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      throw new ValidationError("Horário de início da corrida inválido.");
    }

    return new Date(Date.UTC(
      rideDate.getUTCFullYear(),
      rideDate.getUTCMonth(),
      rideDate.getUTCDate(),
      hours,
      minutes,
      0,
      0,
    ));
  }

  private ensureDriverCanModifyRide(ride: Ride): void {
    const rideStartDateTime = this.getRideStartDateTime(ride);
    const timeUntilRideMs = rideStartDateTime.getTime() - Date.now();

    if (timeUntilRideMs < DRIVER_CHANGE_THRESHOLD_MS) {
      throw new ValidationError(`Não é possível editar ou cancelar a corrida faltando menos de ${DRIVER_CHANGE_THRESHOLD_HOURS} horas para o início.`);
    }
  }

  private convertTimestampToDateString(timestamp: Timestamp): string {
    const dateObj = timestamp.toDate();
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatRideForFrontend(ride: Ride): RideDto {
    return {
      ...ride,
      date: this.convertTimestampToDateString(ride.date)
    };
  }

  private convertDateToTimestamp(date: Date | string): Timestamp {
    let normalizedDate: Date;
    
    if (typeof date === 'string') {
      const parts = date.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const day = parseInt(parts[2], 10);
        normalizedDate = new Date(year, month, day, 0, 0, 0, 0);
      } else {
        normalizedDate = new Date(date);
      }
    } else {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      normalizedDate = new Date(year, month, day, 0, 0, 0, 0);
    }
    
    return Timestamp.fromDate(normalizedDate);
  }

  private isValidCoordinate(lat: number, lng: number): boolean {
    return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
  }

  private async geocodeAddress(address: string): Promise<LatLng | null> {
    const query = address.trim();
    if (!query) {
      return null;
    }

    const results = await this.mapboxService.geocode(query, 1);
    if (!results.length) {
      return null;
    }

    const [lng, lat] = results[0].center;
    if (!this.isValidCoordinate(lat, lng)) {
      return null;
    }

    return [lat, lng];
  }

  private async resolvePickupCoordinates(
    address: string,
    pickupLatLng: number[] | null
  ): Promise<{ lat: number; long: number }> {
    const hasValidLatLng = Array.isArray(pickupLatLng) && pickupLatLng.length === 2
      && Number.isFinite(Number(pickupLatLng[0])) && Number.isFinite(Number(pickupLatLng[1]));
    if (hasValidLatLng) {
      const lat = Number(pickupLatLng![0]);
      const lng = Number(pickupLatLng![1]);
      if (this.isValidCoordinate(lat, lng)) {
        return { lat, long: lng };
      }
    }

    if (!address.trim()) {
      return { lat: 0, long: 0 };
    }

    const geocoded = await this.geocodeAddress(address);
    if (!geocoded) {
      throw new ValidationError("Não foi possível localizar o endereço informado para o embarque.");
    }

    return { lat: geocoded[0], long: geocoded[1] };
  }

  private async resolvePassengerPointsFromPickups(
    passengerPickups: PassengerPickup[]
  ): Promise<LatLng[]> {
    const enriched = await this.enrichPassengerPickups(passengerPickups);
    return enriched
      .map((pickup) => [pickup.lat, pickup.long] as LatLng)
      .filter(([lat, lng]) => this.isValidCoordinate(lat, lng));
  }

  private async enrichPassengerPickups(
    passengerPickups: PassengerPickup[]
  ): Promise<PassengerPickup[]> {
    const enriched: PassengerPickup[] = [];

    for (const pickup of passengerPickups) {
      const lat = Number(pickup.lat);
      const lng = Number(pickup.long);
      if (this.isValidCoordinate(lat, lng)) {
        enriched.push({ ...pickup, lat, long: lng });
        continue;
      }

      if (!pickup.address?.trim()) {
        continue;
      }

      const geocoded = await this.geocodeAddress(pickup.address);
      if (geocoded) {
        enriched.push({
          ...pickup,
          lat: geocoded[0],
          long: geocoded[1],
        });
      }
    }

    return enriched;
  }

  private getCentroid(points: LatLng[]): LatLng {
    const totals = points.reduce(
      (acc, current) => {
        acc.lat += current[0];
        acc.lng += current[1];
        return acc;
      },
      { lat: 0, lng: 0 },
    );

    return [totals.lat / points.length, totals.lng / points.length];
  }

  private async reverseToRoute([lat, lng]: LatLng): Promise<Route> {
    const reverseResults = await this.mapboxService.reverseGeocode([lng, lat]);
    const place = reverseResults[0];
    const context = place?.context || [];

    const city = context.find((c: { id?: string; text?: string }) => c.id?.includes("place"))?.text || "";
    const state = context.find((c: { id?: string; text?: string }) => c.id?.includes("region"))?.text || "";
    const zipCode = context.find((c: { id?: string; text?: string }) => c.id?.includes("postcode"))?.text || "";
    const street = place?.text || "Ponto sugerido";

    return { street, city, state, zipCode, lat, long: lng };
  }

  private haversineMeters(a: LatLng, b: LatLng): number {
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const earthRadius = 6371000;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const sa =
      Math.sin(dLat / 2) ** 2
      + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * earthRadius * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
  }

  private async getByIdInternal(id: string): Promise<Ride> {
    const ride = await this.ridesRepository.getById(id);

    if (!ride) {
        throw new NotFoundError("Corrida não encontrada!");
    }

    return ride;
  }

}
