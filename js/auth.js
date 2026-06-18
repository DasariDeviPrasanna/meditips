import {
  auth,
  provider
} from "./firebase-config.js";

import {
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const loginBtn =
document.getElementById(
  "googleLoginBtn"
);

loginBtn?.addEventListener(
  "click",
  async () => {

    try {

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      console.log(
        result.user
      );

      window.location.href =
      "dashboard.html";

    }
    catch(error){

      console.error(error);

      alert(
        error.message
      );

    }

  }
);