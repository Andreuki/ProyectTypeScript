import { SERVER } from "../constants";
import { Http } from "./http.class.ts";
import type { Property } from "./types.ts";

export class PropertiesService {
    #http = new Http();
    
    async getProperties(): Promise<Property[]> {
        const resp = await this.#http.get<{properties: Property[]}>(`${SERVER}/properties`);
        return resp.properties;
    }

    async insertProperty(property: Property): Promise<Property> {
        const resp = await this.#http.post<{property: Property},Property >(`${SERVER}/properties`, property);
        return resp.property;
    }

    async deleteProperty(id: number): Promise<void> {
        await this.#http.delete(`${SERVER}/properties/${id}`);
    }
}