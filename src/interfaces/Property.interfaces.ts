import type { Town } from "./Town.interface.ts";
import type { User } from "./User.interfaces.ts";

export interface Property extends PropertyInsert {
  id?: number;
  mine: boolean;
  rating?: number;
}

export interface PropertyInsert {
  address: string;
  title: string;
  description: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  price: number;
  townId: number;
  mainPhoto: string;
  createdAt?: string;
  status?: string;
  town: Town;
  seller: User;
}
