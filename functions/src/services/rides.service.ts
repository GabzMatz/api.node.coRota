import { RidesRepository } from "../repositories/rides.repository.js";
import { LatLng } from "../models/base.model.js";
import { MapService } from "./mapbox.service.js";
import { Ride, SearchRide } from "../models/ride.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { RideRole, RidesHistory, RideStatus } from "../models/rides-history.model.js";
import { RidesHistoryService } from "./rides-history.service.js";
import { Timestamp } from "firebase-admin/firestore";

const MEET_THRESHOLD_METERS = Number(process.env.MEET_THRESHOLD_METERS || 3000);
const DRIVER_CHANGE_THRESHOLD_HOURS = 8;
const DRIVER_CHANGE_THRESHOLD_MS = DRIVER_CHANGE_THRESHOLD_HOURS * 60 * 60 * 1000;

export class RidesService {

  constructor(
    private ridesHistoryService = new RidesHistoryService(),
    private ridesRepository = new RidesRepository(),
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

  public async getAll(): Promise<Array<Omit<Ride, 'date'> & { date: string }>> {
    const rides = await this.ridesRepository.getAll();

    const filteredRides = rides.filter(ride => ride.isActive === true  && ride.availableSeats > 0);
    
    return filteredRides.map(ride => this.formatRideForFrontend(ride));
  }

  public async getById(id: string): Promise<Omit<Ride, 'date'> & { date: string }> {
    const ride = await this.getByIdInternal(id);

    return this.formatRideForFrontend(ride);
  }

  public async create(ride: Ride, userId: string): Promise<void> {
    ride.availableSeats = ride.allSeats;
    ride.createdAt = new Date();
  
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
        
    await this.ridesRepository.update(id, _ride);
  }

  public async chooseRide(userId: string, rideId: string): Promise<void> {
    const ride = await this.getByIdInternal(rideId);

    if (ride.availableSeats <= 0)
      throw new ValidationError("O carro não tem mais assentos disponíveis!");

    ride.updatedAt = new Date();
    ride.availableSeats = ride.availableSeats - 1;
    ride.passengerIds?.push(userId);
        
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

    ride.updatedAt = new Date();
    ride.availableSeats = ride.availableSeats + 1;
    ride.passengerIds = ride.passengerIds?.filter(id => id !== userId);
        
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
        
    await this.ridesRepository.update(rideId, ride);
    await this.ridesHistoryService.cancelDriverRide(rideId);
  }

  public async suggestRides(search: SearchRide): Promise<Array<Omit<Ride, 'date'> & { date: string }>> {
    if (!search.departureLatLng || !search.destinationLatLng) {
      throw new Error("Origem e destino são obrigatórios!");
    }

    const now = new Date();
    const allRides = await this.ridesRepository.getAll();
    const activeRides = allRides.filter(ride => ride.isActive === true && ride.availableSeats > 0);
    const matches: Array<Omit<Ride, 'date'> & { date: string }> = [];

    for (const ride of activeRides) {
      const dateObj = ride.date.toDate();
      const dateString = dateObj.toISOString().split('T')[0];

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

  private formatRideForFrontend(ride: Ride): Omit<Ride, 'date'> & { date: string } {
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
        normalizedDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      } else {
        normalizedDate = new Date(date);
      }
    } else {
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();

      normalizedDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    }
    
    return Timestamp.fromDate(normalizedDate);
  }

  private async getByIdInternal(id: string): Promise<Ride> {
    const ride = await this.ridesRepository.getById(id);

    if (!ride) {
        throw new NotFoundError("Corrida não encontrada!");
    }

    return ride;
  }

}
