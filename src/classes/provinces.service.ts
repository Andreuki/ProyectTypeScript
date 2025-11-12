import { SERVER } from "../constants";
import { Http } from "./http.class";

export class ProvincesService {
    #http = new Http();

    async getProvinces() {
        const resp = await this.#http.get(`${SERVER}/provinces`);
        return resp.provinces;
    }

    async getTowns(idProvince) {
        const resp = await this.#http.get(`${SERVER}/provinces/${idProvince}/towns`);
        return resp.towns;
    }
}