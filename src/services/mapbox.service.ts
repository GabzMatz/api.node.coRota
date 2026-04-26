import axios from "axios";
import { LatLng } from "../models/base.model.js";

const MAPBOX_TOKEN = `${process.env.MAPBOX_TOKEN}`;
if (!MAPBOX_TOKEN) throw new Error("MAPBOX_TOKEN not set in .env");

const MAPBOX_GEOCODE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const MAPBOX_DIRECTIONS_URL = "https://api.mapbox.com/directions/v5/mapbox";

export class MapService {
  constructor() {
    this.token = MAPBOX_TOKEN;
    this.geocodeUrl = MAPBOX_GEOCODE_URL;
    this.directionsUrl = MAPBOX_DIRECTIONS_URL;
  }

  private readonly token: string;
  private readonly geocodeUrl: string;
  private readonly directionsUrl: string;

  public async geocode(query: string, limit = 5) {
    const url = `${this.geocodeUrl}/${encodeURIComponent(query)}.json`;

    const response = await axios.get(url, {
      params: {
        access_token: this.token,
        autocomplete: true,
        limit,
      },
    });

    return response.data.features.map((f: any) => ({
      id: f.id,
      place_name: f.place_name,
      text: f.text,
      center: f.center as LatLng,
      context: f.context || [],
    }));
  }

  public async reverseGeocode([lng, lat]: LatLng) {
    const url = `${this.geocodeUrl}/${lng},${lat}.json`;

    const response = await axios.get(url, {
      params: {
        access_token: this.token,
        limit: 1,
      },
    });

    return response.data.features.map((f: any) => ({
      id: f.id,
      place_name: f.place_name,
      text: f.text,
      center: f.center as LatLng,
      context: f.context || [],
    }));
  }

  public async getDirections(coords: string, profile = "driving") {
    const url = `${this.directionsUrl}/${profile}/${coords}`;
    const response = await axios.get(url, {
      params: {
        access_token: this.token,
        geometries: "geojson",
        overview: "full",
        steps: false,
      },
    });

    return response.data; 
  }

  public midpointAlongRoute(geometry: any): LatLng {
    const coords: [number, number][] = geometry.coordinates;

    const distance = (a: [number, number], b: [number, number]) => {
      const R = 6371000; // metros
      const toRad = (d: number) => (d * Math.PI) / 180;
      const lat1 = toRad(a[1]);
      const lat2 = toRad(b[1]);
      const dLat = lat2 - lat1;
      const dLon = toRad(b[0] - a[0]);
      const sa =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
      return R * c;
    };

    const segmentDistances: number[] = [];
    let totalDistance = 0;

    for (let i = 0; i < coords.length - 1; i++) {
      const d = distance(coords[i], coords[i + 1]);
      segmentDistances.push(d);
      totalDistance += d;
    }

    const half = totalDistance / 2;
    let accumulated = 0;

    for (let i = 0; i < segmentDistances.length; i++) {
      if (accumulated + segmentDistances[i] >= half) {
        const remaining = half - accumulated;
        const ratio = remaining / segmentDistances[i];
        const a = coords[i];
        const b = coords[i + 1];
        const lng = a[0] + (b[0] - a[0]) * ratio;
        const lat = a[1] + (b[1] - a[1]) * ratio;
        return [lng, lat];
      }
      accumulated += segmentDistances[i];
    }

    const mid = coords[Math.floor(coords.length / 2)];
    return mid as LatLng;
  }
}
