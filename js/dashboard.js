import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ===========================
// DOM Elements
// ===========================

const photo = document.getElementById("userPhoto");
const welcome = document.getElementById("welcomeText");
const scanCount = document.getElementById("scanCount");
const chatCount = document.getElementById("chatCount");
const recentActivity = document.getElementById("recentActivity");
const tipElement = document.getElementById("healthTip");

// ===========================
// Authentication
// ===========================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // ===========================
    // Greeting
    // ===========================

    const hour = new Date().getHours();

    let greeting = "Good Evening 🌙";

    if (hour < 12) {
        greeting = "Good Morning ☀️";
    } else if (hour < 17) {
        greeting = "Good Afternoon 🌤️";
    }

    // ===========================
    // Load User Profile
    // ===========================

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            welcome.innerHTML =
                `👋 ${greeting}, ${data.name || "User"}`;

            photo.src =
                data.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}`;

        } else {

            welcome.innerHTML =
                `👋 ${greeting}, ${user.displayName || "User"}`;

            photo.src =
                user.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}`;

        }

    } catch (error) {

        console.error("User Profile Error:", error);

    }

    // ===========================
    // Profile Click
    // ===========================

    photo.addEventListener("click", () => {

        window.location.href = "profile.html";

    });

    // ===========================
    // Dashboard Data
    // ===========================

    try {

        // Scan Count

        const historyQuery = query(

            collection(db, "history"),

            where("uid", "==", user.uid)

        );

        const historySnapshot = await getDocs(historyQuery);

        scanCount.textContent = historySnapshot.size;

        // ===========================

        // AI Chat Count

        const chatQuery = query(

            collection(db, "chatHistory"),

            where("uid", "==", user.uid)

        );

        const chatSnapshot = await getDocs(chatQuery);

        chatCount.textContent = chatSnapshot.size;

        // ===========================

        // Recent Activity

        const recentQuery = query(

            collection(db, "history"),

            where("uid", "==", user.uid),

            orderBy("scannedAt", "desc"),

            limit(3)

        );

        const recentSnapshot = await getDocs(recentQuery);

        recentActivity.innerHTML = "";

        if (recentSnapshot.empty) {

            recentActivity.innerHTML = `

                <div class="activity">
                    No recent scans yet.
                </div>

            `;

        } else {

            recentSnapshot.forEach((docSnap) => {

                const item = docSnap.data();

                const date = item.scannedAt?.toDate();

                const time = date
                    ? date.toLocaleString()
                    : "Recently";

                recentActivity.innerHTML += `

                    <div class="activity">

                        <strong>💊 ${item.medicineName}</strong>

                        <br>

                        <small>${time}</small>

                    </div>

                `;

            });

        }

    } catch (error) {

        console.error("Dashboard Error:", error);

    }

});

// ===========================
// Health Tips
// ===========================

const tips = [

    "💧 Drink at least 8 glasses of water today.",

    "🥗 Eat more fruits and vegetables.",

    "🚶 Walk for at least 30 minutes.",

    "😴 Sleep 7-8 hours every night.",

    "💊 Never self-medicate without consulting a doctor.",

    "🩺 Complete your medicine course.",

    "❤️ Exercise regularly for better health.",

    "🍎 Eat a balanced diet every day."

];

if (tipElement) {

    tipElement.textContent =
        tips[Math.floor(Math.random() * tips.length)];

}