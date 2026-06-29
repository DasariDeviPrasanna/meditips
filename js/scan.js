import { db, auth }
from "./firebase-config.js";

import {
  addDoc,
  collection,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const imageInput = document.getElementById("medicineImage");
const previewImage = document.getElementById("previewImage");

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  previewImage.src = URL.createObjectURL(file);
  previewImage.style.display = "block";
});

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}

document.getElementById("scanBtn").addEventListener("click", async () => {
  const file = imageInput.files[0];

  if (!file) {
    alert("Please select an image");
    return;
  }

  try {
    const base64 = await fileToBase64(file);

    const response = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64, mimeType: file.type })
    });

    const data = await response.json();
    console.log("Scan Response:", data);

    if (!data || !data.medicineName) {
      alert("Medicine name not detected. Please try a clearer image.");
      return;
    }

    localStorage.setItem("medicineName", data.medicineName);

    const detected = data.medicineName.toLowerCase();
    let medicineId = "";

    if (detected.includes("dolo"))          medicineId = "dolo650";
    else if (detected.includes("crocin"))   medicineId = "crocin";
    else if (detected.includes("azee"))     medicineId = "azee500";
    else if (detected.includes("pantocid")) medicineId = "pantocid40";
    else if (detected.includes("augmentin")) medicineId = "augmentin625";
    else if (detected.includes("telma"))    medicineId = "telma40";

    localStorage.setItem("medicineId", medicineId || "unknown");
    if (auth.currentUser) {
    await addDoc(
  collection(
    db,
    "history"
  ),
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
    window.location.href = "result.html";

  } catch (error) {
    console.error("Scan Error:", error);
    alert("Scan Failed. Please try again.");
  }
});
const cameraBtn =
document.getElementById("cameraBtn");

const galleryBtn =
document.getElementById("galleryBtn");

const imageInput =
document.getElementById("imageInput");

cameraBtn.addEventListener("click",()=>{

    imageInput.setAttribute(
        "capture",
        "environment"
    );

    imageInput.click();

});

galleryBtn.addEventListener("click",()=>{

    imageInput.removeAttribute(
        "capture"
    );

    imageInput.click();

});