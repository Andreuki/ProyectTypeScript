import type { RegisterData } from "./RegisterData.interfaces";

export interface User extends Omit<RegisterData, "password"> {
  id?: number;
  me?: boolean;
  lat?: number;
  lng?: number;
}

export interface UserLogin {
  email: string;
  password: string;
}
export interface UserProfile {
  name: string;
  email: string;
}

export interface UserAvatar {
  avatar: string;
}

export interface UserPassword {
  password?: string;
}

export interface Rating {
  id: number;
  rating: number;
  comment: string;
  user: User;
  createdAt: string;
  newRating?: number;
}

export interface RatingInsert {
  rating: number;
  comment: string;
}
