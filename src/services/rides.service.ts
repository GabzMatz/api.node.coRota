import { RidesRepository } from "../repositories/rides.repository.js";
import { LatLng } from "../models/base.model.js";
import { MapService } from "./mapbox.service.js";
import { Ride, SearchRide } from "../models/ride.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";

const MEET_THRESHOLD_METERS = Number(process.env.MEET_THRESHOLD_METERS || 3000);

export class RidesService {
  constructor() {
    this.mapboxService = new MapService();
    this.ridesRepository = new RidesRepository();
  }
  
  private ridesRepository: RidesRepository;
  private mapboxService: MapService;

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

  public async create(ride: Ride): Promise<void> {
    ride.availableSeats = ride.allSeats;
    ride.createdAt = new Date();
    await this.ridesRepository.create(ride);
  }

  public async update(id: string, ride: Ride): Promise<void> {
    const _ride = await this.getById(id);
    
    _ride.updatedAt = new Date();
    _ride.createdAt = ride.createdAt;
    _ride.isActive = ride.isActive;
    _ride.driverId = ride.driverId;
    _ride.departureLatLng = ride.departureLatLng;
    _ride.destinationLatLng = ride.destinationLatLng;
    _ride.date = ride.date;
    _ride.time = ride.time;
    _ride.allSeats = ride.allSeats;
    _ride.availableSeats = ride.availableSeats;
    _ride.pricePerPassenger = ride.pricePerPassenger;
    _ride.passengerIds = ride.passengerIds;
        
    await this.ridesRepository.update(_ride);
  }

  public async chooseRide(userId: string, rideId: string): Promise<void> {
    const _ride = await this.getById(rideId);

    if (_ride.allSeats <= _ride.availableSeats)
      throw new ValidationError("O carro não tem mais assentos disponíveis!");

    _ride.updatedAt = new Date();
    _ride.availableSeats = _ride.availableSeats--;
    _ride.passengerIds?.push(userId);
        
    await this.ridesRepository.update(_ride);
  }

  public async cancelRide(userId: string, rideId: string): Promise<void> {
    const _ride = await this.getById(rideId);

    _ride.updatedAt = new Date();
    _ride.availableSeats = _ride.availableSeats++;
    _ride.passengerIds = _ride.passengerIds?.filter(id => id !== userId);
        
    await this.ridesRepository.update(_ride);
  }

  public async suggestRides(search: SearchRide): Promise<Ride[]> {
    if (!search.departureLatLng || !search.destinationLatLng) {
      throw new Error("origin and destination are required.");
    }

    const now = new Date();
    const rides = await this.getAll();
    const matches: Ride[] = [];

    for (const ride of rides) {
      const rideDateTime = new Date(`${ride.date}T${ride.time}`);
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
