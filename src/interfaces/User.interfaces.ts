import type { RegisterData } from "./RegisterData.interfaces";

export interface User extends Omit<RegisterData, "password"> {
  id?: number;
}

export interface UserLogin {
  email: string;
  password: string;
}
