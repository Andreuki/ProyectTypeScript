import { Point } from "ol/geom";
import { MapService } from "./classes/map.service";
import { MyGeolocation } from "./classes/my-geolocation";
import { PropertiesService } from "./classes/properties.service";
import { ProvincesService } from "./classes/provinces.service";
import type { Feature } from "ol";
import type { PropertyInsert } from "./interfaces/Property.interfaces";
import { AuthService } from "./classes/authService";
import type { User } from "./interfaces/User.interfaces";
import type { Town } from "./interfaces/Town.interface";
import type { Province } from "./interfaces/Province.interface";

const authService = new AuthService();

async function authenticatedUser(): Promise<void> {
  try {
    await authService.checkToken();

    const logoutButton = document.getElementById(
      "logout-link"
    ) as HTMLButtonElement;
    logoutButton.classList.remove("hidden");

    logoutButton.addEventListener("click", () => {
      authService.logout();
      location.assign("index.html");
    });

    const propertyForm = document.getElementById(
      "property-form"
    ) as HTMLFormElement;
    const mainPhotoInput = document.getElementById(
      "mainPhoto"
    ) as HTMLInputElement;
    const imagePreview = document.getElementById(
      "image-preview"
    ) as HTMLImageElement;
    const provincesSelect = document.getElementById(
      "province"
    ) as HTMLInputElement;
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
        seller: {} as User,
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

    void loadProvinces();
    void loadMap();
  } catch (e) {
    console.log(e);
    location.assign("index.html");
  }
}

void authenticatedUser();

/* eslint-disable */
declare const LanguageDetector: any;
declare const Translator: any;
declare const Summarizer: any;

async function detectLanguage(text: string): Promise<string> {
  const detector = await LanguageDetector.create({
    expectedInputLanguages: ["en", "es", "de", "fr"],
  });
  const results = await detector?.detect(text);
  return results[0]?.detectedLanguage ?? "en";
}

//NOTA: Si usas Brave no funciona la función para traducir, con Chrome sí funciona

async function translate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const translator = await Translator.create({
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
  });
  return await translator.translate(text);
}

async function summarize(text: string): Promise<string> {
  const summarizer = await Summarizer.create({
    sharedContext:
      "A catchy title for selling a real estate property in the market fast",
    type: "headline",
    length: "short",
    format: "plain-text",
    expectedInputLanguages: ["en", "es"],
    outputLanguage: "en",
  });
  return await summarizer.summarize(text);
}
/* eslint-enable */

const translateBtn = document.getElementById(
  "translate-button"
) as HTMLButtonElement;
const generateBtn = document.getElementById(
  "generate-button"
) as HTMLButtonElement;
const description = document.getElementById(
  "description"
) as HTMLTextAreaElement;
const propertyForm = document.getElementById(
  "property-form"
) as HTMLFormElement;
const titleInput = propertyForm.elements.namedItem("title") as HTMLInputElement;

translateBtn.addEventListener("click", async () => {
  translateBtn.disabled = true;
  try {
    const text = description.value;

    if (!text.trim()) {
      alert("Please enter some text to translate");
      return;
    }

    const detectedLang = await detectLanguage(text);

    if (detectedLang === "en") {
      alert("The text is already in English");
      return;
    }

    description.value = await translate(text, detectedLang, "en");
  } catch (error) {
    alert(
      "Translation error: " +
        (error instanceof Error ? error.message : String(error))
    );
  } finally {
    translateBtn.disabled = false;
  }
});

generateBtn.addEventListener("click", async () => {
  generateBtn.disabled = true;
  try {
    const text = description.value;

    if (text.length < 20) {
      alert(
        "Description must be at least 20 characters long to generate a title"
      );
      return;
    }

    const generatedTitle = await summarize(text);
    titleInput.value = generatedTitle;
  } catch (error) {
    alert(
      "Title generation error: " +
        (error instanceof Error ? error.message : String(error))
    );
  } finally {
    generateBtn.disabled = false;
  }
});
