import {
  auth,
  provider,
  db
} from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const signupBtn =
document.getElementById(
  "signupBtn"
);

const googleBtn =
document.getElementById(
  "googleLoginBtn"
);

// ------------------------
// Email Sign Up
// ------------------------

signupBtn?.addEventListener(
  "click",
  async () => {

    const name =
      document
      .getElementById("name")
      .value.trim();

    const email =
      document
      .getElementById("email")
      .value.trim();

    const password =
      document
      .getElementById("password")
      .value;

    const confirmPassword =
      document
      .getElementById("confirmPassword")
      .value;

    if(
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ){
      alert(
        "Please fill all fields."
      );
      return;
    }

    if(password.length < 6){
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    if(password !== confirmPassword){
      alert(
        "Passwords do not match."
      );
      return;
    }

    try{

      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user =
        result.user;

      await updateProfile(
        user,
        {
          displayName:name
        }
      );

      await setDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {

          uid:user.uid,

          name:name,

          email:user.email,

          photo:user.photoURL || "",

          provider:"Email",

          createdAt:
            serverTimestamp(),

          lastLogin:
            serverTimestamp()

        }
      );

      alert(
        "Account Created Successfully!"
      );

      window.location.href =
        "dashboard.html";

    }

    catch(error){

      console.error(error);

      switch(error.code){

        case "auth/email-already-in-use":

          alert(
            "Email already exists."
          );

          break;

        case "auth/invalid-email":

          alert(
            "Invalid email."
          );

          break;

        case "auth/weak-password":

          alert(
            "Password is too weak."
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

// ------------------------
// Google Sign Up
// ------------------------

googleBtn?.addEventListener(
  "click",
  async()=>{

    try{

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

          uid:user.uid,

          name:user.displayName,

          email:user.email,

          photo:user.photoURL,

          provider:"Google",

          createdAt:
            serverTimestamp(),

          lastLogin:
            serverTimestamp()

        },
        {
          merge:true
        }
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