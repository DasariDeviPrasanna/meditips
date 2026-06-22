import { getMedicine }
from "./medicine-service.js";

async function loadMedicine() {

  const medicineId =
    localStorage.getItem(
      "medicineId"
    );

  if (!medicineId) {
    return;
  }

  const medicine =
    await getMedicine(
      medicineId
    );

  if (!medicine) {

  const medicineName =
    localStorage.getItem(
      "medicineName"
    );

  const response =
    await fetch(
      "/api/medicineinfo",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          medicineName
        })
      }
    );

  const aiData =
    await response.json();
  console.log(
  "AI DATA:",
  aiData
);

alert(
  JSON.stringify(aiData)
);

  document.getElementById(
    "medicineName"
  ).innerText =
    medicineName;

  document.getElementById(
    "uses"
  ).innerText =
    aiData.uses;

  document.getElementById(
    "telugu"
  ).innerText =
    aiData.teluguExplanation;

  return;
}

  document.getElementById(
    "medicineName"
  ).innerText =
  medicine.name;

  document.getElementById(
    "uses"
  ).innerText =
  medicine.uses;

  document.getElementById(
    "telugu"
  ).innerText =
  medicine.teluguExplanation;

}

loadMedicine();