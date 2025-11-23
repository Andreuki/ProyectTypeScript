import { PropertiesService } from "./classes/properties.service";
import type { Property } from "./interfaces/Property.interfaces";
import { MapService } from "./classes/map.service";
import { AuthService } from "./classes/authService";

const properties = new PropertiesService();
const authService = new AuthService();

try {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  if (!id) {
    location.assign("index.html");
  }

  const property: Property = await properties.getPropertyById(Number(id));
  createMap(property);

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

  const title = document.getElementById("property-title") as HTMLTitleElement;
  title.textContent = property.title;

  const townId = property.town.name;

  const fullAdress = document.getElementById(
    "property-address"
  ) as HTMLParagraphElement;
  fullAdress.textContent = `${property.address}, ${townId}`;

  const description = document.getElementById(
    "property-description"
  ) as HTMLParagraphElement;
  description.textContent = property.description;

  const mainPhoto = document.getElementById(
    "property-image"
  ) as HTMLSourceElement;
  mainPhoto.src = property.mainPhoto;

  const price = document.getElementById(
    "property-price"
  ) as HTMLParagraphElement;
  price.textContent = String(priceFormatter(property.price));

  const sqm = document.getElementById("property-sqmeters") as HTMLSpanElement;
  sqm.textContent = String(property.sqmeters);

  const rooms = document.getElementById("property-rooms") as HTMLSpanElement;
  rooms.textContent = String(property.numRooms);

  const baths = document.getElementById("property-baths") as HTMLSpanElement;
  baths.textContent = String(property.numBaths);

  const sellerName = document.getElementById(
    "seller-name"
  ) as HTMLParagraphElement;
  sellerName.textContent = property.seller.name;

  const sellerEmail = document.getElementById(
    "seller-email"
  ) as HTMLParagraphElement;
  sellerEmail.textContent = property.seller.email;

  const profilePicture = document.getElementById(
    "seller-photo"
  ) as HTMLSourceElement;
  profilePicture.src = property.seller.avatar;

  const mortgageCalculatorForm = document.getElementById(
    "mortgage-calculator"
  ) as HTMLFormElement;

  function formValidate(e: Event) {
    e.preventDefault();

    const priceMortgage = document.getElementById(
      "property-price2"
    ) as HTMLInputElement;
    priceMortgage.valueAsNumber = property.price;
    const downPayment = document.getElementById(
      "down-payment"
    ) as HTMLInputElement;

    if (downPayment.value === "" || Number(downPayment.value) <= 0) {
      downPayment.setCustomValidity("Please enter a valid down payment.");
      mortgageCalculatorForm.reportValidity();
      return;
    } else {
      downPayment.setCustomValidity("");
    }

    const loanTerm = document.getElementById("loan-term") as HTMLInputElement;

    if (Number(loanTerm.value) <= 1 || Number(loanTerm.value) >= 40) {
      loanTerm.setCustomValidity("Please enter a valid loan term.");
      mortgageCalculatorForm.reportValidity();
      return;
    } else {
      loanTerm.setCustomValidity("");
    }

    const annualInterestRate = document.getElementById(
      "interest-rate"
    ) as HTMLInputElement;

    if (Number(annualInterestRate.value) <= 0) {
      annualInterestRate.setCustomValidity(
        "Please enter a valid annual interest rate ."
      );
      mortgageCalculatorForm.reportValidity();
      return;
    } else {
      annualInterestRate.setCustomValidity("");
    }

    const properyPrice = property.price;
    const down = Number(downPayment.value);
    const loan = Number(loanTerm.value);
    const annualInterest = Number(annualInterestRate.value);

    const monthlyPaymentResult = calculateMortgage(
      properyPrice,
      down,
      loan,
      annualInterest
    );

    const mortgageResult = document.getElementById(
      "mortgage-result"
    ) as HTMLDivElement;
    mortgageResult.classList.remove("hidden");

    const monthlyPayment = document.getElementById(
      "monthly-payment"
    ) as HTMLParagraphElement;
    monthlyPayment.textContent = String(priceFormatter(monthlyPaymentResult));
  }

  mortgageCalculatorForm.addEventListener("submit", formValidate);
} catch (e) {
  console.log(e);
  location.assign("index.html");
}

function priceFormatter(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function createMap(property: Property) {
  const cordinates = {
    latitude: property.town.latitude,
    longitude: property.town.longitude,
  };

  const map = new MapService(cordinates, "map");

  map.createMarker(cordinates);
}

function calculateMortgage(
  propertyPrice: number,
  downPayment: number,
  loanTerm: number,
  anualInterest: number
): number {
  const totalToPay = propertyPrice - downPayment;
  const monthlyInterestRate = anualInterest / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const numerator =
    monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
  const monthlyPayment = totalToPay * (numerator / denominator);

  return monthlyPayment;
}
