import type { RegisterData } from "./interfaces/RegisterData.interfaces";
import { AuthService } from "./classes/authService";

const auth = new AuthService();

const form = document.getElementById("register-form") as HTMLFormElement;
const avatarPreview = document.getElementById(
  "avatar-preview"
) as HTMLImageElement;
const mainAvatarInput = form.avatar as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const passwordConfirmInput = document.getElementById(
  "password-confirm"
) as HTMLInputElement;

passwordInput.addEventListener("input", () =>
  checkPasswords(passwordInput, passwordConfirmInput)
);
passwordConfirmInput.addEventListener("input", () =>
  checkPasswords(passwordInput, passwordConfirmInput)
);

mainAvatarInput.addEventListener("change", (): void => {
  const file = mainAvatarInput.files?.[0];
  avatarPreview.src = "";
  avatarPreview.classList.add("hidden");

  if (file) {
    if (!file.type.startsWith("image/")) {
      mainAvatarInput.setCustomValidity(
        "Invalid file type. Please upload an image file."
      );
      form.reportValidity();
      return;
    } else if (file.size > 200000) {
      mainAvatarInput.setCustomValidity("File size exceeds 200KB limit.");

      return;
    } else {
      mainAvatarInput.setCustomValidity("");
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        avatarPreview.src = reader.result as string;
        avatarPreview.classList.remove("hidden");
      });
    }
  }

  mainAvatarInput.reportValidity();
});

async function formValidation(e: Event): Promise<void> {
  e.preventDefault();

  const nameUser = document.getElementById("name") as HTMLInputElement;

  if (!nameUser.value) {
    nameUser.setCustomValidity("Please enter your name.");
    form.reportValidity();
    return;
  } else {
    nameUser.setCustomValidity("");
  }

  const email = document.getElementById("email") as HTMLInputElement;

  if (!email.value.trim()) {
    email.setCustomValidity("Please enter an email address.");
    form.reportValidity();
    return;
  } else {
    email.setCustomValidity("");
  }

  const password = passwordInput;

  if (!password.value || password.value.length < 4) {
    password.setCustomValidity("Please enter a valid password.");
    form.reportValidity();
    return;
  } else {
    password.setCustomValidity("");
  }

  const passwordConfirm = passwordConfirmInput;
  checkPasswords(password, passwordConfirm);

  const mainAvatar = document.getElementById("avatar") as HTMLInputElement;
  const file = mainAvatar.files?.[0];
  if (!file) {
    mainAvatar.setCustomValidity("Please upload a main photo.");
    form.reportValidity();
    return;
  } else {
    mainAvatar.setCustomValidity("");
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const base64Avatar = avatarPreview.src.split(",")[1];

  const newUser: RegisterData = {
    name: nameUser.value,
    email: email.value,
    password: password.value,
    avatar: base64Avatar,
  };
  try {
    await auth.register(newUser);
    location.assign("login.html");
    alert("user created");
  } catch (e) {
    alert("Error registering user");
    throw e;
  }
}

function checkPasswords(
  passwordInput: HTMLInputElement,
  passwordConfirmInput: HTMLInputElement
) {
  if (passwordInput.value !== passwordConfirmInput.value) {
    passwordConfirmInput.setCustomValidity("The passwords do not match.");
  } else {
    passwordConfirmInput.setCustomValidity("");
  }
}

form.addEventListener("submit", formValidation);
