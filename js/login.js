import {
  auth
} from "./firebase-config.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const loginBtn =
document.getElementById(
  "loginBtn"
);

loginBtn?.addEventListener(
  "click",
  async () => {

    const email =
      document
      .getElementById(
        "email"
      )
      .value
      .trim();

    const password =
      document
      .getElementById(
        "password"
      )
      .value;

    if (!email || !password) {

      alert(
        "Please enter email and password."
      );

      return;

    }

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert(
        "Login Successful!"
      );

      window.location.href =
        "dashboard.html";

    }

    catch(error){

      console.error(error);

      switch(error.code){

        case "auth/user-not-found":
          alert(
            "User not found."
          );
          break;

        case "auth/wrong-password":
          alert(
            "Incorrect password."
          );
          break;

        case "auth/invalid-email":
          alert(
            "Invalid email."
          );
          break;

        case "auth/invalid-credential":
          alert(
            "Invalid email or password."
          );
          break;

        default:
          alert(
            error.message
          );

      }

    }

  }
);