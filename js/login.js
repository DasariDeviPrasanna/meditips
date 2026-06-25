import {
  auth,
  provider
}
from "./firebase-config.js";

import {
  signInWithPopup
}
from
"https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document
.getElementById(
  "googleLogin"
)
.addEventListener(
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

      console.log(user);

      window.location.href =
        "index.html";

    }

    catch(error) {

      console.log(error);

    }

  }
);