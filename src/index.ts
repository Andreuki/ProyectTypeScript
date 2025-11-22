import { PropertiesService } from "./classes/properties.service";
import type { Property, Province } from "./interfaces/Property.interfaces";
import { ProvincesService } from "./classes/provinces.service";
import type { PropertiesResponse } from "./interfaces/Responses.interfaces";
import { AuthService } from "./classes/authService";

const provincesService = new ProvincesService();
const authService = new AuthService();

async function authenticatedUser(): Promise<void> {
  try {
    await authService.checkToken();

    const logoutButton = document.getElementById(
      "logout-link"
    ) as HTMLButtonElement;
    logoutButton.classList.remove("hidden");

    const showProfile = document.getElementById(
      "profile-link"
    ) as HTMLAnchorElement;
    showProfile.classList.remove("hidden");

    const showNewProperty = document.getElementById(
      "new-property-link"
    ) as HTMLAnchorElement;
    showNewProperty.classList.remove("hidden");

    const removeLogin = document.getElementById(
      "login-link"
    ) as HTMLAnchorElement;
    removeLogin.classList.add("hidden");

    logoutButton.addEventListener("click", () => {
      authService.logout();
      location.assign("index.html");
    });
  } catch (e) {
    console.log("Authentication error ", e);
  }
}

void authenticatedUser();

const propertyListings = document.getElementById(
  "property-listings"
) as HTMLElement;
const cardTemplate = document.getElementById(
  "property-card-template"
) as HTMLTemplateElement;

const propertiesService = new PropertiesService();
let currentPage = 1;
let hasMoreProperties = false;
let currentProvinceId = 0;
let currentSearch = "";

function createAndAppendCard(propertyData: Property): void {
  const cardClone = (cardTemplate.content.cloneNode(true) as DocumentFragment)
    .firstElementChild as HTMLElement;

  const formattedPrice = Intl.NumberFormat("en-US", {
    currency: "EUR",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(propertyData.price);

  const titleLink = cardClone.querySelector(
    ".property-title"
  ) as HTMLAnchorElement;
  titleLink.href = `property-detail.html?id= ${propertyData.id}`;
  titleLink.append(propertyData.title);
  (cardClone.querySelector(".property-location") as HTMLElement).append(
    `${propertyData.address}, ${propertyData.town.name}`
  );
  (cardClone.querySelector(".property-price") as HTMLElement).append(
    formattedPrice
  );
  (cardClone.querySelector(".property-sqmeters") as HTMLElement).append(
    `${propertyData.sqmeters} sqm`
  );
  (cardClone.querySelector(".property-rooms") as HTMLElement).append(
    `${propertyData.numRooms} beds`
  );
  (cardClone.querySelector(".property-baths") as HTMLElement).append(
    `${propertyData.numBaths} baths`
  );
  const image = cardClone.querySelector(".property-image") as HTMLImageElement;
  const imageLink = image.parentElement as HTMLAnchorElement;
  imageLink.href = `property-detail.html?id= ${propertyData.id}`;
  image.src = propertyData.mainPhoto;

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
  const response: PropertiesResponse =
    await propertiesService.getPropertiesWithFilters(
      currentPage,
      currentProvinceId,
      currentSearch
    );

  hasMoreProperties = Boolean(response.more);
  response.properties.forEach(p => createAndAppendCard(p));

  updateLoadMoreButton();
}

void getProperties();

const provincesFilter = document.getElementById(
  "province-filter"
) as HTMLInputElement;

async function loadProvinces(): Promise<void> {
  const provinces: Province[] = await provincesService.getProvinces();
  const options = Array.from(provinces).map(p => {
    const option = document.createElement("option");
    option.value = String(p.id);
    option.append(p.name);
    return option;
  });
  provincesFilter.replaceChildren(
    provincesFilter.firstElementChild as Element,
    ...options
  );
}

void loadProvinces();

const text = document.getElementById("search-text") as HTMLInputElement;
const province = document.getElementById(
  "province-filter"
) as HTMLSelectElement;

async function applyFilters() {
  currentSearch = text.value.toLocaleLowerCase();
  currentProvinceId = Number(province.value);
  let provinceName = "All provinces";
  if (province.selectedIndex > 0) {
    provinceName = province.options[province.selectedIndex].text;
  }
  currentPage = 1;

  propertyListings.innerHTML = "";

  const response: PropertiesResponse =
    await propertiesService.getPropertiesWithFilters(
      currentPage,
      currentProvinceId,
      currentSearch
    );

  hasMoreProperties = Boolean(response.more);
  response.properties.forEach(p => createAndAppendCard(p));

  const filterInfo = document.getElementById("filter-Info") as HTMLDivElement;

  if (provinceName === "All provinces" && currentSearch === "") {
    filterInfo.textContent = "No filters applied";
  } else if (provinceName !== "All provinces" && currentSearch === "") {
    filterInfo.textContent = `Province: ${provinceName}.`;
  } else {
    filterInfo.textContent = `Province: ${provinceName}. Search: ${currentSearch}`;
  }

  updateLoadMoreButton();
}

const submitBtn = document.querySelector(
  "#search-and-filter button"
) as HTMLButtonElement;

submitBtn.addEventListener("click", async e => {
  e.preventDefault();
  await applyFilters();
});

const morePropertiesBtn = document.getElementById(
  "load-more-btn"
) as HTMLButtonElement;

morePropertiesBtn.addEventListener("click", async (): Promise<void> => {
  currentPage++;
  console.log(`Página actual: ${currentPage}`);
  await loadMoreProperties();
  updateLoadMoreButton();
});

async function loadMoreProperties(): Promise<void> {
  const response: PropertiesResponse =
    await propertiesService.getPropertiesWithFilters(
      currentPage,
      currentProvinceId,
      currentSearch
    );

  hasMoreProperties = Boolean(response.more);
  response.properties.forEach(p => createAndAppendCard(p));
}

function updateLoadMoreButton(): void {
  if (hasMoreProperties) {
    morePropertiesBtn.classList.remove("hidden");
  } else {
    morePropertiesBtn.classList.add("hidden");
  }
}
