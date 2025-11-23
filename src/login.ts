import { AuthService } from "./classes/authService";
import type { UserLogin } from "./interfaces/User.interfaces";

const authService = new AuthService();

try {
  await authService.checkToken();
  location.assign("index.html");
} catch (e) {
  console.log(e);
}

const form = document.getElementById("login-form") as HTMLFormElement;

async function formValidation(e: Event): Promise<void> {
  e.preventDefault();

  const email = document.getElementById("email") as HTMLInputElement;

  if (!email.value.trim()) {
    email.setCustomValidity("Please enter an email address.");
    form.reportValidity();
    return;
  } else {
    email.setCustomValidity("");
  }

  const password = document.getElementById("password") as HTMLInputElement;

  if (!password.value) {
    password.setCustomValidity("Please enter a valid password.");
    form.reportValidity();
    return;
  } else {
    password.setCustomValidity("");
  }
  const user: UserLogin = {
    email: email.value,
    password: password.value,
  };

  try {
    await authService.login(user);
    location.assign("index.html");
  } catch (e) {
    alert("login error!");
    throw e;
  }
}

form.addEventListener("submit", formValidation);
