import { SERVER } from "../constants";
import { Http } from "./http.class.ts";
import type { Province, Town } from "../interfaces/Property.interfaces.ts";
import type {
  ProvincesResponse,
  TownsResponse,
} from "../interfaces/Responses.interfaces.ts";

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
