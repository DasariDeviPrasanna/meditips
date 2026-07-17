import { auth, db } from "./firebase-config.js";
import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
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

const favoriteBtn = document.getElementById("favoriteBtn");

async function checkFavorite() {

    if (!auth.currentUser) return;

    const medicineName = localStorage.getItem("medicineName");

    const q = query(
        collection(db, "favorites"),
        where("uid", "==", auth.currentUser.uid),
        where("medicineName", "==", medicineName)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {

        favoriteBtn.innerHTML = "💔 Remove Favorite";
        favoriteBtn.dataset.docId = snap.docs[0].id;

    } else {

        favoriteBtn.innerHTML = "❤️ Save to Favorites";

    }

}

auth.onAuthStateChanged(async (user) => {

    if (user) {

        await checkFavorite();

    }

});

favoriteBtn?.addEventListener("click", async () => {

    if (!auth.currentUser) {

        alert("Please login first.");

        return;

    }

    const medicineName = localStorage.getItem("medicineName");

    try {

        if (favoriteBtn.dataset.docId) {

            await deleteDoc(
                doc(db, "favorites", favoriteBtn.dataset.docId)
            );

            favoriteBtn.innerHTML = "❤️ Save to Favorites";

            delete favoriteBtn.dataset.docId;

            alert("Removed from Favorites");

        } else {

            const ref = await addDoc(
                collection(db, "favorites"),
                {
                    uid: auth.currentUser.uid,
                    medicineName,
                    savedAt: serverTimestamp()
                }
            );

            favoriteBtn.dataset.docId = ref.id;

            favoriteBtn.innerHTML = "💔 Remove Favorite";

            alert("Added to Favorites");

        }

    } catch (error) {

        console.error(error);

        alert("Unable to update favorites.");

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
