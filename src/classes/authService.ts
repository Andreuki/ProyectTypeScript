import { Http } from "./http.class";
import { SERVER } from "../constants";
import type { RegisterData } from "../interfaces/RegisterData.interfaces";
import type {
  SingleUserResponse,
  TokenResponse,
} from "../interfaces/Responses.interfaces";
import type { UserLogin } from "../interfaces/User.interfaces";

export class AuthService {
  #http = new Http();

  async login(userLogin: UserLogin): Promise<void> {
    const token = await this.#http.post<TokenResponse, UserLogin>(
      `${SERVER}/auth/login`,
      userLogin
    );
    localStorage.setItem("token", token.accessToken);
  }

  async register(userInfo: RegisterData): Promise<void> {
    await this.#http.post<SingleUserResponse, RegisterData>(
      `${SERVER}/auth/register`,
      userInfo
    );
  }
  async checkToken(): Promise<void> {
    await this.#http.get(`${SERVER}/auth/validate`);
  }

  logout(): void {
    localStorage.removeItem("token");
  }
}
