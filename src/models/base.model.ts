export interface Base {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export type LatLng = [number, number]; 