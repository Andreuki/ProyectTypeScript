import { SERVER } from "../constants";
import { Http } from "./http.class.ts";
import type { Province, Town } from "./types.ts";


export class ProvincesService {
  #http = new Http();

  async getProvinces(): Promise<Province[]> {
    const resp = await this.#http.get<{ provinces: Province[] }>(
      `${SERVER}/provinces`
    );
    return resp.provinces;
  }

  async getTowns(idProvince: number): Promise<Town[]> {
    const resp = await this.#http.get<{ towns: Town[] }>(
      `${SERVER}/provinces/${idProvince}/towns`
    );
    return resp.towns;
  }
}
