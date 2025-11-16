import { PropertiesService } from "./classes/properties.service";
import type { Property } from "./interfaces/Property.interfaces";

const propertyListings = document.getElementById(
  "property-listings"
) as HTMLElement;
const cardTemplate = document.getElementById(
  "property-card-template"
) as HTMLTemplateElement;

const propertiesService = new PropertiesService();

/**
 * Creates a new property card and appends it to the DOM
 * @param {object} propertyData - An object with property's data
 */
function createAndAppendCard(propertyData: Property): void {
  const cardClone = (cardTemplate.content.cloneNode(true) as DocumentFragment)
    .firstElementChild as HTMLElement;

  const formattedPrice = Intl.NumberFormat("en-US", {
    currency: "EUR",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(propertyData.price);

  (cardClone.querySelector(".property-title") as HTMLElement).append(
    propertyData.title
  );
  (cardClone.querySelector(".property-location") as HTMLElement).append(
    `${propertyData.address}, ${propertyData.town.name}, ${propertyData.town.province.name}`
  );
  (cardClone.querySelector(".property-price") as HTMLElement).append(
    formattedPrice
  );
  /* (cardClone
    .querySelector(".property-description")as HTMLElement)
    .append(propertyData.description); */
  (cardClone.querySelector(".property-sqmeters") as HTMLElement).append(
    `${propertyData.sqmeters} sqm`
  );
  (cardClone.querySelector(".property-rooms") as HTMLElement).append(
    `${propertyData.numRooms} beds`
  );
  (cardClone.querySelector(".property-baths") as HTMLElement).append(
    `${propertyData.numBaths} baths`
  );
  (cardClone.querySelector(".property-image") as HTMLImageElement).src =
    propertyData.mainPhoto;

  (cardClone.querySelector(".btn-delete") as HTMLElement).addEventListener(
    "click",
    async () => {
      if (propertyData.id !== undefined) {
        await propertiesService.deleteProperty(propertyData.id);
        cardClone.remove();
      }
    }
  );

  propertyListings.append(cardClone);
}

async function getProperties(): Promise<void> {
  const properties = await propertiesService.getProperties();
  properties.forEach(p => createAndAppendCard(p));
}

void getProperties();
