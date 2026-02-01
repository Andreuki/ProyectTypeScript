import type { Property } from "./Property.interfaces";
import type { Province } from "./Province.interface.ts";
import type { Town } from "./Town.interface.ts";
import type { Rating, User } from "./User.interfaces";

export interface TokenResponse {
  accessToken: string;
}

export interface PropertiesResponse {
  properties: Property[];
  more: boolean;
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

export interface AvatarUpdateResponse {
  user: User;
}
export interface PasswordUpdateResponse {
  user: User;
}

export interface RatingResponse {
  rating: Rating;
  newRating: number;
}

export interface RatingsResponse {
  ratings: Rating[];
}

export interface SingleRatingResponse {
  rating: Rating;
  newRating: number;
}
