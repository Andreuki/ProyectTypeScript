import { SERVER } from "../constants";
import { Http } from "./http.class.ts";
import type {
  Property,
  PropertyInsert,
} from "../interfaces/Property.interfaces.ts";
import type {
  PropertiesResponse,
  SinglePropertyResponse,
} from "../interfaces/Responses.interfaces.ts";

export class PropertiesService {
  #http = new Http();

  async getProperties(): Promise<Property[]> {
    const resp = await this.#http.get<PropertiesResponse>(
      `${SERVER}/properties`
    );
    return resp.properties;
  }

  async getPropertyById(id: number): Promise<Property> {
    const resp = await this.#http.get<SinglePropertyResponse>(
      `${SERVER}/properties/${id}`
    );
    return resp.property;
  }

  async insertProperty(property: Property): Promise<Property> {
    const resp = await this.#http.post<SinglePropertyResponse, PropertyInsert>(
      `${SERVER}/properties`,
      property
    );
    return resp.property;
  }

  async deleteProperty(id: number): Promise<void> {
    await this.#http.delete(`${SERVER}/properties/${id}`);
  }

  /*  async addRating(id: number, rating: RatingInsert): Promise<Rating> {

     }
    async getRatings(id: number): Promise<Rating[]> {

    } */
}
