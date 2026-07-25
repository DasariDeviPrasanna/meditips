import { translatePage }
from "./translator.js";
import { auth }
from "./firebase-config.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
translatePage();
onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      window.location.href =
        "dashboard.html";

    }

  }
);