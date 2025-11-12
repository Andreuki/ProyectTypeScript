import { PropertiesService } from "./classes/properties.service";

const propertyListings = document.getElementById("property-listings");
const cardTemplate = document.getElementById("property-card-template");

const propertiesService = new PropertiesService();

/**
 * Creates a new property card and appends it to the DOM
 * @param {object} propertyData - An object with property's data
 */
function createAndAppendCard(propertyData) {
  const cardClone = cardTemplate.content.cloneNode(true).firstElementChild;

  const formattedPrice = Intl.NumberFormat("en-US", {
    currency: "EUR",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(propertyData.price);

  cardClone.querySelector(".property-title").append(propertyData.title);
  cardClone
    .querySelector(".property-location")
    .append(`${propertyData.address}, ${propertyData.town.name}, ${propertyData.town.province.name}`);
  cardClone.querySelector(".property-price").append(formattedPrice);
  cardClone
    .querySelector(".property-description")
    .append(propertyData.description);
  cardClone
    .querySelector(".property-sqmeters")
    .append(`${propertyData.sqmeters} sqm`);
  cardClone
    .querySelector(".property-rooms")
    .append(`${propertyData.numRooms} beds`);
  cardClone
    .querySelector(".property-baths")
    .append(`${propertyData.numBaths} baths`);
  cardClone.querySelector(".property-image").src = propertyData.mainPhoto;

  cardClone.querySelector(".btn-delete").addEventListener('click', async () => {
    await propertiesService.deleteProperty(propertyData.id);
    cardClone.remove();
  });

  propertyListings.append(cardClone);
}

async function getProperties() {
    const properties = await propertiesService.getProperties();
    properties.forEach(p => createAndAppendCard(p));
}

getProperties();