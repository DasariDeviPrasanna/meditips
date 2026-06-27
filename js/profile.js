import {
  auth,
  db
} from "./firebase-config.js";

import {
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const photo =
document.getElementById(
  "photo"
);

const name =
document.getElementById(
  "name"
);

const email =
document.getElementById(
  "email"
);

const editBtn =
document.getElementById(
  "editProfile"
);

onAuthStateChanged(
  auth,
  async(user)=>{

    if(!user){

      window.location.href =
      "login.html";

      return;

    }

    photo.src =
      user.photoURL ||
      "https://ui-avatars.com/api/?name=User";

    name.innerText =
      user.displayName ||
      "User";

    email.innerText =
      user.email;

    const userRef =
      doc(
        db,
        "users",
        user.uid
      );

    const snap =
      await getDoc(
        userRef
      );

    if(
      snap.exists()
    ){

      const data =
        snap.data();

      if(data.name){

        name.innerText =
        data.name;

      }

    }

    editBtn.onclick =
    async()=>{

      const newName =
      prompt(
      "Enter your name",
      name.innerText
      );

      if(!newName)
      return;

      try{

        await updateProfile(
          auth.currentUser,
          {
            displayName:
            newName
          }
        );

        await updateDoc(
          userRef,
          {
            name:
            newName
          }
        );

        name.innerText =
        newName;

        alert(
        "Profile Updated"
        );

      }

      catch(error){

        console.error(
        error
        );

      }

    };

  }
);