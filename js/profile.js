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
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Elements

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

const editProfileBtn =
document.getElementById("editProfileBtn");

// ======================
// Load Profile
// ======================

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href="login.html";

        return;

    }

    try{

        // Firestore User Data

        const userRef = doc(db,"users",user.uid);

        const userSnap = await getDoc(userRef);

        if(userSnap.exists()){

            const data = userSnap.data();

            profileName.textContent =
            data.name || "User";

            profileEmail.textContent =
            data.email || user.email;

            profilePhoto.src =
            data.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}`;

        }

        else{

            profileName.textContent =
            user.displayName || "User";

            profileEmail.textContent =
            user.email;

            profilePhoto.src =
            user.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}`;

        }

        // ======================
        // Total Scans
        // ======================

        const scanQuery = query(

            collection(db,"history"),

            where("uid","==",user.uid)

        );

        const scanSnapshot =
        await getDocs(scanQuery);

        totalScans.textContent =
        scanSnapshot.size;

        // ======================
        // AI Chats
        // ======================

        const chatQuery = query(

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

// ======================
// Edit Profile
// ======================

editProfileBtn?.addEventListener("click",()=>{

    window.location.href="edit-profile.html";

});

// ======================
// Logout
// ======================

logoutBtn?.addEventListener("click",async()=>{

    try{

        await signOut(auth);

        window.location.href="login.html";

    }

    catch(error){

        console.error(error);

        alert("Logout Failed");

    }

});