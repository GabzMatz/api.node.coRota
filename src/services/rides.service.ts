import { RidesRepository } from "../repositories/rides.repository.js";
import { LatLng } from "../models/base.model.js";
import { MapService } from "./mapbox.service.js";
import { Ride } from "../models/ride.model.js";

const MEET_THRESHOLD_METERS = Number(process.env.MEET_THRESHOLD_METERS || 3000);

export class RidesService {
  constructor() {
    this.mapboxService = new MapService();
    this.ridesRepository = new RidesRepository();
  }
  
  private ridesRepository: RidesRepository;
  private mapboxService: MapService;

  public async getAll(): Promise<Ride[]> {
    return await this.ridesRepository.getAll();
  }

  public async create(ride: Ride): Promise<void> {
    await this.ridesRepository.create(ride);
  }

  public async suggestRides(origin: LatLng, destination: LatLng): Promise<Ride[]> {
    if (!origin || !destination) {
      throw new Error("origin and destination are required.");
    }

    const rides = await this.ridesRepository.getAll();
    const matches: Ride[] = [];

    for (const ride of rides) {
      const driverOrigin: LatLng = ride.departureLatLng;
      const driverDestination: LatLng = ride.destinationLatLng;

      // Driver original route
      const origCoords = `${driverOrigin[1]},${driverOrigin[0]};${driverDestination[1]},${driverDestination[0]}`;
      const origDir = await this.mapboxService.getDirections(origCoords, "driving");
      const origDistance = origDir.routes?.[0]?.distance ?? Infinity;

      // Passanger pickup point route
      const withPickupCoords = `${driverOrigin[1]},${driverOrigin[0]};${origin[1]},${origin[0]};${driverDestination[1]},${driverDestination[0]}`;
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
