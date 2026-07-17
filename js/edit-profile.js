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
let selectedFile = null;

photoInput.onchange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    selectedFile = file;

    photo.src = URL.createObjectURL(file);

};

async function uploadToCloudinary(file){

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", "meditips_profile");

    const response = await fetch(

        "https://api.cloudinary.com/v1_1/dbndj5bud/image/upload",

        {

            method: "POST",

            body: formData

        }

    );

    const data = await response.json();

    return data.secure_url;

}
// Save
saveBtn.onclick = async () => {

    const user = auth.currentUser;

    if (!user) return;

    try {

        let finalPhotoURL = user.photoURL || "";

        // Upload only if user selected a new image

        if (selectedFile) {

            finalPhotoURL = await uploadToCloudinary(selectedFile);

        }

        await updateProfile(user, {

            displayName: nameInput.value,

            photoURL: finalPhotoURL

        });

        await updateDoc(

            doc(db, "users", user.uid),

            {

                name: nameInput.value,

                email: user.email,

                photo: finalPhotoURL

            }

        );

        alert("✅ Profile Updated Successfully");

        window.location.href = "profile.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};