import { auth, db } from "./firebase-config.js";

import {
updateProfile,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const photo =
document.getElementById("editPhoto");

const nameInput =
document.getElementById("editName");

const emailInput =
document.getElementById("editEmail");

const photoInput =
document.getElementById("photoInput");

const changePhotoBtn =
document.getElementById("changePhotoBtn");

const saveBtn =
document.getElementById("saveProfileBtn");

let photoURL = "";

onAuthStateChanged(auth,user=>{

if(!user){

location.href="login.html";

return;

}

photo.src=

user.photoURL ||

`https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||"User")}`;

nameInput.value=

user.displayName || "";

emailInput.value=

user.email;

photoURL=

user.photoURL || "";

});

// Preview image

changePhotoBtn.onclick=()=>{

photoInput.click();

};

photoInput.onchange=(e)=>{

const file=

e.target.files[0];

if(!file) return;

const reader=

new FileReader();

reader.onload=()=>{

photo.src=

reader.result;

photoURL=

reader.result;

};

reader.readAsDataURL(file);

};

// Save
saveBtn.onclick = async () => {

    const user = auth.currentUser;

    if(!user){

        return;

    }

    try{

        await updateProfile(

            user,

            {

                displayName:nameInput.value,

                photoURL:photoURL

            }

        );

        await updateDoc(

            doc(db,"users",user.uid),

            {

                name:nameInput.value,

                photo:photoURL

            }

        );

        alert("✅ Profile Updated Successfully");

        window.location.href="profile.html";

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};