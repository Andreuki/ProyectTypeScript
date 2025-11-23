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
