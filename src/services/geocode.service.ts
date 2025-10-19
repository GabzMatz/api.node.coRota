import { MapService } from "../services/mapbox.service.js";
import { Route } from "../models/ride.model.js";
import { ValidationError } from "../errors/validation.error.js";

export class GeocodeService {
  constructor() {
    this.mapboxService = new MapService();
  }

  private mapboxService: MapService;

  public async search(query: string): Promise<Partial<Route>[]> {
    if (!query || query.length == 0) {
      throw new ValidationError("Parâmetro de busca (q) é obrigatório.");
    }

    const results = await this.mapboxService.geocode(query, 5);

    return results.map((r: any) => ({
      street: r.text,
      city: r.context?.find((c: any) => c.id.includes("place"))?.text || "",
      state: r.context?.find((c: any) => c.id.includes("region"))?.text || "",
      zipCode: r.context?.find((c: any) => c.id.includes("postcode"))?.text || "",
      lat: r.center?.[1]?.toString(),
      long: r.center?.[0]?.toString(),
    }));
  }
}
