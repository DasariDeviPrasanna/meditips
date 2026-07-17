import { auth, db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const favoritesList = document.getElementById("favoritesList");

auth.onAuthStateChanged(async (user) => {

    if (!user) {

        favoritesList.innerHTML = `
            <p>Please login to view favorites.</p>
        `;

        return;
    }

    loadFavorites(user.uid);

});

async function loadFavorites(uid) {

    favoritesList.innerHTML = "<p>Loading...</p>";

    try {

        const q = query(
            collection(db, "favorites"),
            where("uid", "==", uid),
            orderBy("savedAt", "desc")
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            favoritesList.innerHTML = `
                <div class="empty">
                    <h3>No Favorites Yet ❤️</h3>
                    <p>Save medicines to see them here.</p>
                </div>
            `;

            return;
        }

        favoritesList.innerHTML = "";

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            const card = document.createElement("div");

            card.className = "favorite-card";

            card.innerHTML = `
                <h3>💊 ${data.medicineName}</h3>

                <div class="buttons">
                    <button class="view-btn">View</button>
                    <button class="delete-btn">Remove</button>
                </div>
            `;

            // View Medicine
            card.querySelector(".view-btn").onclick = () => {

                localStorage.setItem(
                    "medicineName",
                    data.medicineName
                );

                window.location.href = "result.html";

            };

            // Remove Favorite
            card.querySelector(".delete-btn").onclick = async () => {

                if (!confirm("Remove this medicine from favorites?"))
                    return;

                await deleteDoc(
                    doc(db, "favorites", docSnap.id)
                );

                loadFavorites(uid);

            };

            favoritesList.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

        favoritesList.innerHTML =
            "<p>Unable to load favorites.</p>";

    }

}