import {
  auth,
  provider,
  db
} from "./firebase-config.js";

import {
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

      const user =
        result.user;

      await setDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          uid:
            user.uid,

          name:
            user.displayName,

          email:
            user.email,

          photo:
            user.photoURL,

          createdAt:
            new Date()
              .toISOString()
        }
      );

      console.log(
        "User Saved:",
        user
      );

      window.location.href =
        "dashboard.html";

    }

    catch(error) {

      console.error(
        error
      );

      alert(
        error.message
      );

    }

  }
);