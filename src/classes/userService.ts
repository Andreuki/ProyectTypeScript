import type { User } from "../interfaces/User.interfaces";
import { Http } from "./http.class";
import { SERVER } from "../constants";
import type { SingleUserResponse } from "../interfaces/Responses.interfaces";

export class UserService {
  #http = new Http();

  async getProfile(id?: number): Promise<User> {
    let enpoint: string;
    if (id) {
      enpoint = `${SERVER}/users/${id}`;
    } else {
      enpoint = `${SERVER}/users/me`;
    }
    const resp = await this.#http.get<SingleUserResponse>(enpoint);
    return resp.user;
  }

  /* async saveProfile(name: string, email: string): Promise<void> {

    }
    async saveAvatar(avatar: string): Promise<string> {

    }
    async savePassword(password: string): Promise<void> {
        
    } */
}
