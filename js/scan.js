import { db, auth } from "./firebase-config.js";

import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Elements

const imageInput =
document.getElementById("imageInput");

const previewImage =
document.getElementById("previewImage");

const statusIcon =
document.getElementById("statusIcon");

const imageStatus =
document.getElementById("imageStatus");

const cameraBtn =
document.getElementById("cameraBtn");

const galleryBtn =
document.getElementById("galleryBtn");

const scanBtn =
document.getElementById("scanBtn");

const loadingOverlay =
document.getElementById("loadingOverlay");

const loadingText =
document.getElementById("loadingText");

// Camera

cameraBtn.addEventListener("click",()=>{

    imageInput.setAttribute(
        "capture",
        "environment"
    );

    imageInput.click();

});

// Gallery

galleryBtn.addEventListener("click",()=>{

    imageInput.removeAttribute(
        "capture"
    );

    imageInput.click();

});

// Preview

imageInput.addEventListener("change",(event)=>{

    const file =
    event.target.files[0];

    if(!file) return;

    previewImage.src =
    URL.createObjectURL(file);

    statusIcon.textContent =
    "✅";

    imageStatus.textContent =
    "Ready to Scan";

});

// Convert Image

function fileToBase64(file){

    return new Promise((resolve)=>{

        const reader =
        new FileReader();

        reader.onload=()=>{

            resolve(
                reader.result.split(",")[1]
            );

        };

        reader.readAsDataURL(file);

    });

}

// Scan

scanBtn.addEventListener("click",async()=>{

    const file =
    imageInput.files[0];

    if(!file){

        alert("Please select a medicine image.");

        return;

    }

    try{

        loadingOverlay.style.display =
        "flex";

        loadingText.textContent =
        "🔍 Detecting Medicine...";

        const base64 =
        await fileToBase64(file);

        const response =
        await fetch("/api/scan",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                image:base64,

                mimeType:file.type

            })

        });

        const data =
        await response.json();

        if(!data.medicineName){

            loadingOverlay.style.display =
            "none";

            alert("Medicine not detected.");

            return;

        }

        loadingText.textContent =
        "🧠 Preparing Medicine Report...";

        localStorage.setItem(
            "medicineName",
            data.medicineName
        );

        if(auth.currentUser){

            await addDoc(

                collection(db,"history"),

                {

                    uid:
                    auth.currentUser.uid,

                    medicineName:
                    data.medicineName,

                    scannedAt:
                    serverTimestamp()

                }

            );

        }

        loadingText.textContent =
        "✅ Opening Result...";

        setTimeout(()=>{

            window.location.href =
            "result.html";

        },700);

    }

    catch(error){

        console.error(error);

        loadingOverlay.style.display =
        "none";

        alert("Scan failed. Please try again.");

    }

});
