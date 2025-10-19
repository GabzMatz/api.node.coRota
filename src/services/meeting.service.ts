import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { LatLng } from "../models/base.model.js";
import { Route } from "../models/ride.model.js";
import { MapService } from "./mapbox.service.js";

export class MeetingService {
  constructor() {
    this.mapboxService = new MapService();
  }

  private mapboxService: MapService;

  public async calculateMeetingPoint(personA: LatLng, personB: LatLng): Promise<Route> {
    if (!personA || !personB) {
      throw new ValidationError("Dados inválidos!");
    }

    const toLngLat = ([lat, lng]: [number, number]) => [lng, lat];
    const coords = `${toLngLat(personA).join(',')};${toLngLat(personB).join(',')}`;
    const directions = await this.mapboxService.getDirections(coords, "driving");

    if (!directions.routes || directions.routes.length === 0) {
      throw new NotFoundError("Rotas não encontradas!");
    }

    const geometry = directions.routes[0].geometry;
    const midpoint = this.mapboxService.midpointAlongRoute(geometry);

    const reverseResults = await this.mapboxService.reverseGeocode(midpoint);

    const place = reverseResults[0];
    const context = place.context || [];

    const city = context.find((c: any) => c.id.includes("place"))?.text || "";
    const state = context.find((c: any) => c.id.includes("region"))?.text || "";
    const zipCode = context.find((c: any) => c.id.includes("postcode"))?.text || "";
    const street = place.text || "";

    return {
      street,
      city,
      state,
      zipCode,
      lat: midpoint[1],
      long: midpoint[0],
    };
  }
}
