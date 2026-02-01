import { SERVER } from "../constants";
import { Http } from "./http.class.ts";
import type {
  ProvincesResponse,
  TownsResponse,
} from "../interfaces/Responses.interfaces.ts";
import type { Province } from "../interfaces/Province.interface.ts";
import type { Town } from "../interfaces/Town.interface.ts";

export class ProvincesService {
  #http = new Http();

  async getProvinces(): Promise<Province[]> {
    const resp = await this.#http.get<ProvincesResponse>(`${SERVER}/provinces`);
    return resp.provinces;
  }

  async getTowns(idProvince: number): Promise<Town[]> {
    const resp = await this.#http.get<TownsResponse>(
      `${SERVER}/provinces/${idProvince}/towns`
    );
    return resp.towns;
  }
}
