import { auth, db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const list =
document.getElementById("favoritesList");

async function loadFavorites(){

    if(!auth.currentUser){

        list.innerHTML =
        "<p>Please login.</p>";

        return;

    }

    const q =
    query(

        collection(db,"favorites"),

        where("uid","==",auth.currentUser.uid),

        orderBy("savedAt","desc")

    );

    const snapshot =
    await getDocs(q);

    list.innerHTML="";

    if(snapshot.empty){

        list.innerHTML =
        "<p>No favorites yet ❤️</p>";

        return;

    }

    snapshot.forEach(doc=>{

        const data =
        doc.data();

        list.innerHTML += `

        <div class="favorite-card">

            <div>

                <h3>💊 ${data.medicineName}</h3>

            </div>

            <button
            class="openBtn"
            data-name="${data.medicineName}">

            Open

            </button>

        </div>

        `;

    });

    document
    .querySelectorAll(".openBtn")
    .forEach(btn=>{

        btn.onclick=()=>{

            localStorage.setItem(

                "medicineName",

                btn.dataset.name

            );

            window.location.href =
            "result.html";

        };

    });

}

auth.onAuthStateChanged(user=>{

    if(user){

        loadFavorites();

    }

});