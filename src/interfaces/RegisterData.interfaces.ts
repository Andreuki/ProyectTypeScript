import type { LoginData } from "./LoginData.interfaces";

export interface RegisterData extends LoginData {
  name: string;
  avatar?: string; //base64
}
