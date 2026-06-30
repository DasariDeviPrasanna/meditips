import { db, auth } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const historyList =
document.getElementById("historyList");

const totalScans =
document.getElementById("totalScans");

const totalChats =
document.getElementById("totalChats");

const mostMedicine =
document.getElementById("mostMedicine");

const lastScan =
document.getElementById("lastScan");

const filterButtons =
document.querySelectorAll(".filter-btn");

let currentFilter = "all";

// ==============================
// Load History
// ==============================

async function loadHistory(user){

    historyList.innerHTML="";

    const historyQuery=query(

        collection(db,"history"),

        where("uid","==",user.uid),

        orderBy("scannedAt","desc")

    );

    const historySnap=
    await getDocs(historyQuery);

    totalScans.textContent=
    historySnap.size;

    const counts={};

    const today=
    new Date();

    // ---------- Empty ----------

    if(historySnap.empty){

        historyList.innerHTML=`

        <div class="empty-history">

            <h1>📭</h1>

            <h3>

                No Scan History

            </h3>

            <p>

                Scan your first medicine.

            </p>

        </div>

        `;

        mostMedicine.textContent="-";

        lastScan.textContent="-";

    }

    // ---------- Cards ----------

    historySnap.forEach(doc=>{

        const data=
        doc.data();

        const date=
        data.scannedAt?.toDate();

        let show=true;

        if(currentFilter==="today"){

            show=
            date &&
            date.toDateString()===
            today.toDateString();

        }

        else if(currentFilter==="week"){

            const diff=

            (today-date)/(1000*60*60*24);

            show=
            diff<=7;

        }

        if(!show){

            return;

        }

        counts[data.medicineName]=
        (counts[data.medicineName]||0)+1;

        const time=
        date
        ? date.toLocaleString()
        : "Recently";

        historyList.innerHTML+=`

        <div
        class="history-card"
        data-name="${data.medicineName}">

            <h3>

                💊 ${data.medicineName}

            </h3>

            <p>

                🕒 ${time}

            </p>

        </div>

        `;

    });

    // ---------- Most Scanned ----------

    let highest=0;

    let medicine="-";

    for(const key in counts){

        if(counts[key]>highest){

            highest=
            counts[key];

            medicine=
            key;

        }

    }

    mostMedicine.textContent=
    medicine;

    // ---------- Last Scan ----------

    if(historySnap.docs.length){

        const latest=
        historySnap.docs[0].data();

        const latestDate=
        latest.scannedAt?.toDate();

        lastScan.textContent=
        latestDate
        ? latestDate.toLocaleString()
        : "-";

    }

    // ---------- Click Card ----------

    document
    .querySelectorAll(".history-card")
    .forEach(card=>{

        card.onclick=()=>{

            localStorage.setItem(

                "medicineName",

                card.dataset.name

            );

            localStorage.setItem(

                "medicineId",

                "unknown"

            );

            window.location.href=
            "result.html";

        };

    });

    // ---------- AI Chats ----------

    const chatQuery=query(

        collection(db,"chatHistory"),

        where("uid","==",user.uid)

    );

    const chatSnap=
    await getDocs(chatQuery);

    totalChats.textContent=
    chatSnap.size;

}

// ==============================
// Auth
// ==============================

onAuthStateChanged(auth,user=>{

    if(user){

        loadHistory(user);

    }

    else{

        window.location.href=
        "login.html";

    }

});

// ==============================
// Filters
// ==============================

filterButtons.forEach(btn=>{

    btn.onclick=()=>{

        filterButtons.forEach(button=>{

            button.classList.remove("active");

        });

        btn.classList.add("active");

        currentFilter=
        btn.dataset.filter;

        if(auth.currentUser){

            loadHistory(auth.currentUser);

        }

    };

});