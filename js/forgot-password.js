import { translatePage }
from "./translator.js";
import {
  auth
} from "./firebase-config.js";

import {
  sendPasswordResetEmail
} from
"https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

translatePage();

document
.getElementById(
  "resetBtn"
)
.addEventListener(
  "click",
  async()=>{

    const email=
      document
      .getElementById(
        "email"
      )
      .value
      .trim();

    if(!email){

      alert(
        "Please enter email."
      );

      return;

    }

    try{

      await sendPasswordResetEmail(
        auth,
        email
      );

      alert(
        "Password reset link sent successfully."
      );

      window.location.href=
      "login.html";

    }

    catch(error){

      console.error(error);

      alert(
        error.message
      );

    }

  }
);