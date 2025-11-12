import { Point } from "ol/geom.js";
import { MapService } from "./classes/map.service";
import { MyGeolocation } from "./classes/my-geolocation";
import { PropertiesService } from "./classes/properties.service";
import { ProvincesService } from "./classes/provinces.service";

const propertyForm = document.getElementById("property-form");
const mainPhotoInput = document.getElementById("mainPhoto");
const imagePreview = document.getElementById("image-preview");
const provincesSelect = document.getElementById("province");
const townsSelect = document.getElementById("town");

const propertiesService = new PropertiesService();
const provincesService = new ProvincesService();
let mapService = null;
let marker = null;

let towns = [];

mainPhotoInput.addEventListener("change", () => {
  const file = mainPhotoInput.files[0];
  imagePreview.src = "";
  imagePreview.classList.add("hidden");

  if (file) {
    if(!file.type.startsWith("image")) {
      mainPhotoInput.setCustomValidity("File must be an image");
    } else if(file.size > 200000) {
      mainPhotoInput.setCustomValidity("You can't add an image larger than 200KB");
    } else {
      mainPhotoInput.setCustomValidity("");

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener('load', () => {
        imagePreview.src = reader.result;
        imagePreview.classList.remove("hidden");
      });
    }
    mainPhotoInput.reportValidity();
  }
});

propertyForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if(!propertyForm.reportValidity()) { return; }

  const formData = new FormData(propertyForm);

  const propertyData = {
    title: formData.get("title"),
    description: formData.get("description"),
    townId: +formData.get("town"),
    address: formData.get("address"),
    price: +formData.get("price"),
    sqmeters: +formData.get("sqmeters"),
    numRooms: +formData.get("numRooms"),
    numBaths: +formData.get("numBaths"),
    mainPhoto: imagePreview.src,
  };

  await propertiesService.insertProperty(propertyData);
  location.assign('index.html');
});

provincesSelect.addEventListener("change", () => loadTowns(+provincesSelect.value));
townsSelect.addEventListener("change", () => {
  const {latitude, longitude} = towns?.find(t => t.id === +townsSelect.value) ?? {};
  mapService.view.setCenter([longitude ?? 0, latitude ?? 0]);
  marker.setGeometry(new Point([longitude ?? 0, latitude ?? 0]));
});

async function loadProvinces() {
  const provinces = await provincesService.getProvinces();
  const options = await Array.from(provinces).map(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.append(p.name);
    return option;
  });
  provincesSelect.replaceChildren(provincesSelect.firstElementChild, ...options);
} 

async function loadTowns(idProvince) {
  towns = await provincesService.getTowns(idProvince);
  const options = await towns.map(t => {
    const option = document.createElement("option");
    option.value = t.id;
    option.append(t.name);
    return option;
  });
  townsSelect.replaceChildren(townsSelect.firstElementChild, ...options);
}

async function loadMap() {
  const coords = await MyGeolocation.getLocation();
  mapService = new MapService(coords, "map");
  marker = mapService.createMarker(coords);
}


loadProvinces();
loadMap();

