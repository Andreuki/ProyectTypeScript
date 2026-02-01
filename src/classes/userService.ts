import type {
  User,
  UserAvatar,
  UserPassword,
  UserProfile,
} from "../interfaces/User.interfaces";
import { Http } from "./http.class";
import { SERVER } from "../constants";
import type {
  AvatarUpdateResponse,
  PasswordUpdateResponse,
  SingleUserResponse,
} from "../interfaces/Responses.interfaces";

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

  async saveProfile(name: string, email: string): Promise<void> {
    await this.#http.put<SingleUserResponse, UserProfile>(
      `${SERVER}/users/me`,
      { name, email }
    );
  }
  async saveAvatar(avatar: string): Promise<string> {
    const resp = await this.#http.put<AvatarUpdateResponse, UserAvatar>(
      `${SERVER}/users/me/avatar`,
      { avatar }
    );
    return resp.user.avatar;
  }
  async savePassword(password: string): Promise<void> {
    await this.#http.put<PasswordUpdateResponse, UserPassword>(
      `${SERVER}/users/me/password`,
      { password }
    );
  }
}
