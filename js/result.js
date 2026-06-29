import { auth, db } from "./firebase-config.js";

import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
async function loadMedicine() {

    const medicineName =
    localStorage.getItem("medicineName");

    if (!medicineName) {

        alert("Medicine not found.");

        window.location.href = "scan.html";

        return;

    }

    try {

        const response =
        await fetch("/api/medicineinfo", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                medicineName

            })

        });

        const data =
        await response.json();

        document.getElementById("medicineName").textContent =
        medicineName;

        document.getElementById("uses").textContent =
        data.uses || "Not Available";

        document.getElementById("telugu").textContent =
        data.teluguExplanation || "అందుబాటులో లేదు";

        document.getElementById("sideEffects").textContent =
        data.sideEffects || "Not Available";

        document.getElementById("diet").textContent =
        data.diet || "Not Available";

        document.getElementById("dosage").textContent =
        data.dosage || "Consult your doctor.";

        document.getElementById("warnings").textContent =
        data.warnings || "Follow your doctor's advice.";

    }

    catch(error){

        console.error(error);

        alert("Unable to load medicine information.");

    }

}

loadMedicine();

// ❤️ Favorite

import {
    auth,
    db
} from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const favoriteBtn =
document.getElementById("favoriteBtn");


favoriteBtn?.addEventListener("click", async () => {

    if (!auth.currentUser) {

        alert("Please login first.");

        return;

    }

    try {

        await addDoc(

            collection(db, "favorites"),

            {

                uid: auth.currentUser.uid,

                medicineName: localStorage.getItem("medicineName"),

                savedAt: serverTimestamp()

            }

        );

        favoriteBtn.innerHTML = "❤️ Saved";

        favoriteBtn.disabled = true;

    }

    catch (error) {

        console.error(error);

        alert("Unable to save favorite.");

    }

});


// 🤖 AI

const askAiBtn =
document.getElementById("askAiBtn");

askAiBtn?.addEventListener("click",()=>{

    window.location.href="assistant.html";

});
const shareBtn =
document.getElementById("shareBtn");

shareBtn?.addEventListener("click",async()=>{

const medicineName =
localStorage.getItem("medicineName");

if(navigator.share){

await navigator.share({

title:"Meditips",

text:`Check this medicine: ${medicineName}`

});

}else{

navigator.clipboard.writeText(medicineName);

alert("Medicine name copied!");

}

});
