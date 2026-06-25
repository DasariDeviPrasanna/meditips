import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
}
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore
}
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAmNN_NFoRUM-a1ycEzwX-aG9b8JZTNjM",
  authDomain: "meditips-aba76.firebaseapp.com",
  projectId: "meditips-aba76",
  storageBucket: "meditips-aba76.firebasestorage.app",
  messagingSenderId: "508289006590",
  appId: "1:508289006590:web:80308bc39ca9e17cf7deaf",
  measurementId: "G-3S4W6QWDGJ"
};

const app =
  initializeApp(
    firebaseConfig
  );

const auth =
  getAuth(app);

const db =
  getFirestore(app);

const provider =
  new GoogleAuthProvider();

export {
  app,
  auth,
  db,
  provider
};