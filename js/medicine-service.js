import { db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

export async function getMedicine(docId) {

  const medicineRef =
    doc(db, "medicines", docId);

  const medicineSnap =
    await getDoc(medicineRef);

  if (medicineSnap.exists()) {
    return medicineSnap.data();
  }

  return null;
}