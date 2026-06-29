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
    limit
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const photo =
document.getElementById("userPhoto");

const welcome =
document.getElementById("welcomeText");

const scanCount =
document.getElementById("scanCount");

const chatCount =
document.getElementById("chatCount");

const recentActivity =
document.getElementById("recentActivity");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
        "login.html";

        return;

    }

    // Greeting

    const hour =
    new Date().getHours();

    let greeting =
    "Good Evening 🌙";

    if(hour<12){

        greeting=
        "Good Morning ☀️";

    }

    else if(hour<17){

        greeting=
        "Good Afternoon 🌤️";

    }

    welcome.innerHTML=
    `👋 ${greeting},
    ${user.displayName}`;

    // Profile Photo

    photo.src=
    user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}`;

    photo.onclick=()=>{

        window.location.href=
        "profile.html";

    };

    // Scan Count

    const historyQuery=query(

        collection(db,"history"),

        where("uid","==",user.uid)

    );

    const historySnapshot=
    await getDocs(historyQuery);

    scanCount.textContent=
    historySnapshot.size;

    // AI Chats

    const chatQuery=query(

        collection(db,"chatHistory"),

        where("uid","==",user.uid)

    );

    const chatSnapshot=
    await getDocs(chatQuery);

    chatCount.textContent=
    chatSnapshot.size;

    // Recent Activity

    const recentQuery=query(

        collection(db,"history"),

        where("uid","==",user.uid),

        orderBy("scannedAt","desc"),

        limit(3)

    );

    const recentSnapshot=
    await getDocs(recentQuery);

    recentActivity.innerHTML="";

    if(recentSnapshot.empty){

        recentActivity.innerHTML=
        "<div class='activity'>No recent scans yet.</div>";

    }

    else{

        recentSnapshot.forEach(doc=>{

            const item=
            doc.data();

            recentActivity.innerHTML+=`

            <div class="activity">

                💊 ${item.medicineName}

            </div>

            `;

        });

    }

});