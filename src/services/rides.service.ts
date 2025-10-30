import { RidesRepository } from "../repositories/rides.repository.js";
import { LatLng } from "../models/base.model.js";
import { MapService } from "./mapbox.service.js";
import { Ride, SearchRide } from "../models/ride.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { RideRole, RidesHistory, RideStatus } from "../models/rides-history.model.js";
import { RidesHistoryService } from "./rides-history.service.js";

const MEET_THRESHOLD_METERS = Number(process.env.MEET_THRESHOLD_METERS || 3000);

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

  public async getAll(): Promise<Ride[]> {
    const rides = await this.ridesRepository.getAll();

    return rides.filter(ride => ride.isActive === true  && ride.availableSeats > 0);
  }

  public async getById(id: string): Promise<Ride> {
    const ride = await this.ridesRepository.getById(id);

    if (!ride) {
        throw new NotFoundError("Corrida não encontrada!");
    }

    return ride;
  }

  public async create(ride: Ride, userId: string): Promise<void> {
    ride.availableSeats = ride.allSeats;
    ride.createdAt = new Date();
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
    const _ride = await this.getById(id);
    
    _ride.updatedAt = new Date();
    _ride.isActive = ride.isActive;
    _ride.driverId = ride.driverId;
    _ride.departureLatLng = ride.departureLatLng;
    _ride.destinationLatLng = ride.destinationLatLng;
    _ride.date = ride.date;
    _ride.startTime = ride.startTime;
    _ride.endTime = ride.endTime;
    _ride.allSeats = ride.allSeats;
    _ride.availableSeats = ride.availableSeats;
    _ride.pricePerPassenger = ride.pricePerPassenger;
    _ride.passengerIds = ride.passengerIds;
        
    await this.ridesRepository.update(id, _ride);
  }

  public async chooseRide(userId: string, rideId: string): Promise<void> {
    const ride = await this.getById(rideId);

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
    const ride = await this.getById(rideId);

    ride.updatedAt = new Date();
    ride.availableSeats = ride.availableSeats + 1;
    ride.passengerIds = ride.passengerIds?.filter(id => id !== userId);
        
    await this.ridesRepository.update(rideId, ride);
    await this.ridesHistoryService.cancelUserRide(rideId, userId);
  }

  public async driverCancelRide(userId: string, rideId: string): Promise<void> {
    const ride = await this.getById(rideId);

    ride.updatedAt = new Date();
    ride.availableSeats = 0;
    ride.isActive = false;
        
    await this.ridesRepository.update(rideId, ride);
    await this.ridesHistoryService.cancelDriverRide(rideId, userId);
  }

  public async suggestRides(search: SearchRide): Promise<Ride[]> {
    if (!search.departureLatLng || !search.destinationLatLng) {
      throw new Error("Origem e destino são obrigatórios!");
    }

    const now = new Date();
    const rides = await this.getAll();
    const matches: Ride[] = [];

    for (const ride of rides) {
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
        matches.push({
          ...ride,
          extraMeters: extra,
        });
      }
    }

    // Order by distance
    matches.sort((a, b) => a.extraMeters - b.extraMeters);

    return matches;
  }
}
