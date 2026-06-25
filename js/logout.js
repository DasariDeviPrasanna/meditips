import { auth }
from "./firebase-config.js";

import {
  signOut
}
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document
.getElementById(
  "logoutBtn"
)
?.addEventListener(
  "click",
  async () => {

    await signOut(auth);

    window.location.href =
      "login.html";

  }
);