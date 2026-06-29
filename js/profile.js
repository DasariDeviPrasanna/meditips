import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const profilePhoto =
document.getElementById("profilePhoto");

const profileName =
document.getElementById("profileName");

const profileEmail =
document.getElementById("profileEmail");

const totalScans =
document.getElementById("totalScans");

const totalChats =
document.getElementById("totalChats");

const logoutBtn =
document.getElementById("logoutBtn");

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href =
        "login.html";

        return;

    }

    // User Info

    profileName.textContent =
    user.displayName || "User";

    profileEmail.textContent =
    user.email;

    profilePhoto.src =
    user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}`;

    try{

        // Scan Count

        const scanQuery =
        query(

            collection(db,"history"),

            where("uid","==",user.uid)

        );

        const scanSnapshot =
        await getDocs(scanQuery);

        totalScans.textContent =
        scanSnapshot.size;

        // Chat Count

        const chatQuery =
        query(

            collection(db,"chatHistory"),

            where("uid","==",user.uid)

        );

        const chatSnapshot =
        await getDocs(chatQuery);

        totalChats.textContent =
        chatSnapshot.size;

    }

    catch(error){

        console.error(error);

    }

});

// Logout

logoutBtn.addEventListener(

"click",

async()=>{

    await signOut(auth);

    window.location.href =
    "login.html";

});
