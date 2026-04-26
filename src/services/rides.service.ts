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

    const maxAvailableSeats = driverCarSeats - 1;
    if (ride.allSeats > maxAvailableSeats) {
      throw new ValidationError(`Seu veículo permite no máximo ${maxAvailableSeats} assentos disponíveis.`);
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

    await this.ridesRepository.update(rideId, ride);
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

    const passengerPoints: LatLng[] = passengerPickups
      .map((pickup) => [Number(pickup.lat), Number(pickup.long)] as LatLng)
      .filter(([lat, lng]) => !Number.isNaN(lat) && !Number.isNaN(lng) && lat !== 0 && lng !== 0);

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

    const passengerPickups = (ride.passengerPickups || []).filter((pickup) => {
      const lat = Number(pickup.lat);
      const lng = Number(pickup.long);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return false;
      }
      return true;
    });

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
    const hasValidLatLng = Array.isArray(pickupLatLng) && pickupLatLng.length === 2
      && Number.isFinite(Number(pickupLatLng[0])) && Number.isFinite(Number(pickupLatLng[1]));

    const passengerPickup = {
      userId,
      address: normalizedPickupAddress,
      lat: hasValidLatLng ? Number(pickupLatLng![0]) : 0,
      long: hasValidLatLng ? Number(pickupLatLng![1]) : 0,
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
