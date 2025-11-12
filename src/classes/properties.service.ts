import { SERVER } from "../constants";
import { Http } from "./http.class";

export class PropertiesService {
    #http = new Http();

    async getProperties() {
        const resp = await this.#http.get(`${SERVER}/properties`);
        return resp.properties;
    }

    async insertProperty(property) {
        const resp = await this.#http.post(`${SERVER}/properties`, property);
        return resp.property;
    }

    async deleteProperty(id) {
        await this.#http.delete(`${SERVER}/properties/${id}`);
    }
}