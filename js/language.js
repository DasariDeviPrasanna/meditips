import { auth, db } from "./firebase-config.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const buttons = document.querySelectorAll(".lang-btn");

let currentLanguage =
    localStorage.getItem("language") || "en";

highlightButton();

buttons.forEach(btn => {

    btn.addEventListener("click", async () => {

        const lang = btn.dataset.lang;

        localStorage.setItem("language", lang);

        currentLanguage = lang;

        highlightButton();

        if(auth.currentUser){

            await updateDoc(

                doc(db,"users",auth.currentUser.uid),

                {

                    language:lang

                }

            );

        }

        alert("Language Updated");

    });

});

function highlightButton(){

    buttons.forEach(btn=>{

        btn.classList.remove("active");

        if(btn.dataset.lang===currentLanguage){

            btn.classList.add("active");

        }

    });

}