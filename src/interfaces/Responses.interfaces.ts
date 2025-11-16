import type { Property, Province, Town } from "./Property.interfaces";
import type { User } from "./User.interfaces";

export interface TokenResponse {
  accessToken: string;
}

export interface PropertiesResponse {
  properties: Property[];
}

export interface SinglePropertyResponse {
  property: Property;
}

export interface ProvincesResponse {
  provinces: Province[];
}

export interface TownsResponse {
  towns: Town[];
}

export interface SingleUserResponse {
  user: User;
  statusCode?: number;
}
export interface UsersResponse {
  users: User[];
}
