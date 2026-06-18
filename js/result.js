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
    alert(
      "Medicine not found"
    );
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