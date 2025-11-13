import type { LoginData } from "./LoginData.interfaces";

export interface RegisterData extends LoginData{

    name: string;
    email: string;
    password: string;
    avatar: string; //base64
 
}