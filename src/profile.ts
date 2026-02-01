import { AuthService } from "./classes/authService";
import { UserService } from "./classes/userService";

const authService = new AuthService();
const userService = new UserService();

async function init() {
  try {
    await authService.checkToken();

    const params = new URLSearchParams(location.search);
    const userId = params.get("id");

    const user = await userService.getProfile(
      userId ? Number(userId) : undefined
    );

    const userName = document.getElementById("user-name") as HTMLElement;
    const userEmail = document.getElementById("user-email") as HTMLElement;
    const userAvatar = document.getElementById(
      "avatar-image"
    ) as HTMLImageElement;
    const editProfileBtn = document.getElementById(
      "edit-profile-btn"
    ) as HTMLButtonElement;
    const changePasswordBtn = document.getElementById(
      "change-password-btn"
    ) as HTMLButtonElement;
    const avatarOverlay = document.getElementById(
      "avatar-image-overlay"
    ) as HTMLElement;
    const avatarInput = document.getElementById(
      "avatar-upload"
    ) as HTMLInputElement;
    const viewPropertiesBtn = document.getElementById(
      "my-properties-link"
    ) as HTMLAnchorElement;

    const editProfileForm = document.getElementById(
      "edit-profile-form"
    ) as HTMLFormElement;
    const changePasswordForm = document.getElementById(
      "change-password-form"
    ) as HTMLFormElement;

    const nameInput = document.getElementById("name") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "new-password"
    ) as HTMLInputElement;

    userName.textContent = user.name;
    userEmail.textContent = user.email;
    userAvatar.src = user.avatar;
    nameInput.value = user.name;
    emailInput.value = user.email;

    viewPropertiesBtn.href = `index.html?seller=${user.id}`;

    if (!user.me) {
      editProfileBtn.classList.add("hidden");
      changePasswordBtn.classList.add("hidden");
      avatarOverlay.classList.add("hidden");
      avatarInput.disabled = true;
    }

    // Avatar Update
    avatarInput.addEventListener("change", () => {
      const file = avatarInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          try {
            const newAvatar = await userService.saveAvatar(base64);
            userAvatar.src = newAvatar;
            alert("Avatar updated successfully!");
          } catch (e: unknown) {
            alert(`Error updating avatar ${(e as Error).message}`);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    editProfileBtn.addEventListener("click", () => {
      editProfileBtn.classList.add("hidden");
      editProfileForm.classList.remove("hidden");
      changePasswordBtn.classList.add("hidden");
    });

    document
      .getElementById("cancel-edit-profile")
      ?.addEventListener("click", () => {
        editProfileForm.classList.add("hidden");
        editProfileBtn.classList.remove("hidden");
        changePasswordBtn.classList.remove("hidden");
      });

    changePasswordBtn.addEventListener("click", () => {
      changePasswordBtn.classList.add("hidden");
      changePasswordForm.classList.remove("hidden");
      editProfileBtn.classList.add("hidden");
    });

    document
      .getElementById("cancel-change-password")
      ?.addEventListener("click", () => {
        changePasswordForm.classList.add("hidden");
        changePasswordBtn.classList.remove("hidden");
        editProfileBtn.classList.remove("hidden");
      });

    editProfileForm.addEventListener("submit", async e => {
      e.preventDefault();
      try {
        await userService.saveProfile(nameInput.value, emailInput.value);
        userName.textContent = nameInput.value;
        userEmail.textContent = emailInput.value;
        editProfileForm.classList.add("hidden");
        editProfileBtn.classList.remove("hidden");
        alert("Profile updated successfully!");
      } catch (e: unknown) {
        alert(`Error updating profile. ${(e as Error).message}`);
      }
    });

    changePasswordForm.addEventListener("submit", async e => {
      e.preventDefault();
      try {
        await userService.savePassword(passwordInput.value);
        passwordInput.value = "";
        changePasswordForm.classList.add("hidden");
        changePasswordBtn.classList.remove("hidden");
        alert("Password updated successfully!");
      } catch (e: unknown) {
        alert(`Error changing password. ${(e as Error).message}`);
      }
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("401")) {
      console.error(`Auth failed ${e.message}`);
      location.assign("index.html");
    } else {
      console.error(`Initialization error ${(e as Error).message}`);
      alert("Error loading profile. Check console for details.");
    }
  }
}

void init();
