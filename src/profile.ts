import { AuthService } from "./classes/authService";
import { UserService } from "./classes/userService";

const authService = new AuthService();
const userService = new UserService();

try {
  await authService.checkToken();

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const me = params.get("me");
  

  const user = await userService.getProfile(Number(id));

  const userName = document.getElementById("user-name") as HTMLTitleElement;
  userName.textContent = user.name;

  const userEmail = document.getElementById(
    "user-email"
  ) as HTMLParagraphElement;
  userEmail.textContent = user.email;

  const userAvatar = document.getElementById(
    "avatar-image"
  ) as HTMLImageElement;
  userAvatar.src = user.avatar;

  if (!me) {
    const editProfile = document.getElementById(
      "edit-profile-btn"
    ) as HTMLButtonElement;
    editProfile.classList.add("hidden");

    const editPassword = document.getElementById(
      "change-password-btn"
    ) as HTMLButtonElement;
    editPassword.classList.add("hidden");

    const editAvatar = document.getElementById(
      "avatar-image-overlay"
    ) as HTMLDivElement;
    editAvatar.classList.add("hidden");

    const avatarUpload = document.getElementById(
      "avatar-upload"
    ) as HTMLInputElement;
    avatarUpload.disabled = true;
  }
} catch (e) {
  console.log(e);
  location.assign("index.html");
}
