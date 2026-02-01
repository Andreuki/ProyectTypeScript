import type { Province } from "./Province.interface";

export interface Town {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  province: Province;
}
