import { SERVER } from "../constants";
import { Http } from "./http.class.ts";
import type {
  Property,
  PropertyInsert,
} from "../interfaces/Property.interfaces.ts";
import type {
  PropertiesResponse,
  RatingResponse,
  RatingsResponse,
  SinglePropertyResponse,
} from "../interfaces/Responses.interfaces.ts";
import type { Rating, RatingInsert } from "../interfaces/User.interfaces.ts";

export class PropertiesService {
  #http = new Http();

  /*   async getProperties(): Promise<Property[]> {
    const resp = await this.#http.get<PropertiesResponse>(
      `${SERVER}/properties`
    );
    return resp.properties;
  } */

  async getPropertiesWithFilters(
    page: number = 1,
    provinceId: number = 0,
    search: string = "",
    seller: number = 0
  ): Promise<PropertiesResponse> {
    const params = new URLSearchParams({
      page: String(page),
      ...(provinceId !== 0 && { province: String(provinceId) }),
      ...(search !== "" && { search }),
      ...(seller !== 0 && { seller: String(seller) }),
    });

    const resp = await this.#http.get<PropertiesResponse>(
      `${SERVER}/properties?${params.toString()}`
    );
    return resp;
  }
  async getPropertyById(id: number): Promise<Property> {
    const resp = await this.#http.get<SinglePropertyResponse>(
      `${SERVER}/properties/${id}`
    );
    return resp.property;
  }

  async insertProperty(property: PropertyInsert): Promise<Property> {
    const resp = await this.#http.post<SinglePropertyResponse, PropertyInsert>(
      `${SERVER}/properties`,
      property
    );
    return resp.property;
  }

  async deleteProperty(id: number): Promise<void> {
    await this.#http.delete(`${SERVER}/properties/${id}`);
  }

  async addRating(id: number, rating: RatingInsert): Promise<Rating> {
    const resp = await this.#http.post<RatingResponse, RatingInsert>(
      `${SERVER}/properties/${id}/ratings`,
      rating
    );
    return { ...resp.rating, newRating: resp.newRating } as Rating;
  }

  async getRating(id: number): Promise<Rating[]> {
    const resp = await this.#http.get<RatingsResponse>(
      `${SERVER}/properties/${id}/ratings`
    );
    return resp.ratings;
  }
}
