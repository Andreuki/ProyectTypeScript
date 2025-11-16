import { Point } from "ol/geom";
import { MapService } from "./classes/map.service";
import { MyGeolocation } from "./classes/my-geolocation";
import { PropertiesService } from "./classes/properties.service";
import { ProvincesService } from "./classes/provinces.service";
import type { Feature } from "ol";
import type {
  Town,
  PropertyInsert,
  Province,
} from "./interfaces/Property.interfaces";

const propertyForm = document.getElementById(
  "property-form"
) as HTMLFormElement;
const mainPhotoInput = document.getElementById("mainPhoto") as HTMLInputElement;
const imagePreview = document.getElementById(
  "image-preview"
) as HTMLImageElement;
const provincesSelect = document.getElementById("province") as HTMLInputElement;
const townsSelect = document.getElementById("town") as HTMLInputElement;

const propertiesService = new PropertiesService();
const provincesService = new ProvincesService();
let mapService: MapService;
let marker: Feature;

let towns: Town[] = [];

mainPhotoInput.addEventListener("change", (): void => {
  const file = mainPhotoInput.files?.[0];
  imagePreview.src = "";
  imagePreview.classList.add("hidden");

  if (file) {
    if (!file.type.startsWith("image")) {
      mainPhotoInput.setCustomValidity("File must be an image");
    } else if (file.size > 200000) {
      mainPhotoInput.setCustomValidity(
        "You can't add an image larger than 200KB"
      );
    } else {
      mainPhotoInput.setCustomValidity("");

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        imagePreview.src = reader.result as string;
        imagePreview.classList.remove("hidden");
      });
    }
    mainPhotoInput.reportValidity();
  }
});

propertyForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  if (!propertyForm.reportValidity()) {
    return;
  }

  const formData = new FormData(propertyForm);

  const propertyData: PropertyInsert = {
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    address: getString(formData, "address"),
    townId: Number(formData.get("town")),
    price: Number(formData.get("price")),
    sqmeters: Number(formData.get("sqmeters")),
    numRooms: Number(formData.get("numRooms")),
    numBaths: Number(formData.get("numBaths")),
    mainPhoto: imagePreview.src,
    town: {} as Town,
  };

  await propertiesService.insertProperty(propertyData);
  location.assign("index.html");
});

function getString(fd: FormData, key: string): string {
  const value = fd.get(key);

  if (typeof value === "string") return value;

  throw new Error(`The field ${key} does not contain a valid string`);
}

provincesSelect.addEventListener("change", () =>
  loadTowns(Number(provincesSelect.value))
);
townsSelect.addEventListener("change", () => {
  const { latitude, longitude } =
    towns?.find(t => t.id === Number(townsSelect.value)) ?? {};
  mapService.view.setCenter([longitude ?? 0, latitude ?? 0]);
  marker.setGeometry(new Point([longitude ?? 0, latitude ?? 0]));
});

async function loadProvinces(): Promise<void> {
  const provinces: Province[] = await provincesService.getProvinces();
  const options = Array.from(provinces).map(p => {
    const option = document.createElement("option");
    option.value = String(p.id);
    option.append(p.name);
    return option;
  });
  provincesSelect.replaceChildren(
    provincesSelect.firstElementChild as Element,
    ...options
  );
}

async function loadTowns(idProvince: number): Promise<void> {
  towns = await provincesService.getTowns(idProvince);
  const options = towns.map(t => {
    const option = document.createElement("option");
    option.value = String(t.id);
    option.append(t.name);
    return option;
  });
  townsSelect.replaceChildren(
    townsSelect.firstElementChild as Element,
    ...options
  );
}

async function loadMap() {
  const coords = await MyGeolocation.getLocation();
  mapService = new MapService(coords, "map");
  marker = mapService.createMarker(coords);
}

await loadProvinces();
await loadMap();
