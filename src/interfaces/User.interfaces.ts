import type { RegisterData } from "./RegisterData.interfaces";

export interface User extends Omit <RegisterData, "password">{
    patata: number;

    

}