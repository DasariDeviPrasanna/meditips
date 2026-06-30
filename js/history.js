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

async function loadHistory(user){

    // ==========================
    // Scan History
    // ==========================

    const historyQuery = query(

        collection(db,"history"),

        where("uid","==",user.uid),

        orderBy("scannedAt","desc")

    );

    const historySnap =
    await getDocs(historyQuery);

    historyList.innerHTML="";

    totalScans.textContent =
    historySnap.size;

    const counts = {};

    if(historySnap.empty){

        historyList.innerHTML=`

        <div class="empty-history">

            <h1>📭</h1>

            <h3>

                No Scan History

            </h3>

            <p>

                Scan your first medicine to view history.

            </p>

        </div>

        `;

        mostMedicine.textContent="-";

        lastScan.textContent="-";

    }

    else{

        historySnap.forEach(doc=>{

            const data=
            doc.data();

            const date=
            data.scannedAt?.toDate();

            const time=
            date
            ? date.toLocaleString()
            : "Recently";

            counts[data.medicineName]=
            (counts[data.medicineName]||0)+1;

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

        // ==========================
        // Most Scanned
        // ==========================

        let highest=0;

        let medicine="-";

        for(const key in counts){

            if(counts[key]>highest){

                highest=counts[key];

                medicine=key;

            }

        }

        mostMedicine.textContent=
        medicine;

        // ==========================
        // Last Scan
        // ==========================

        const latest=
        historySnap.docs[0].data();

        const latestDate=
        latest.scannedAt?.toDate();

        lastScan.textContent=
        latestDate
        ? latestDate.toLocaleDateString()
        : "-";

        // ==========================
        // Open Result Page
        // ==========================

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

    }

    // ==========================
    // AI Chats
    // ==========================

    const chatQuery=query(

        collection(db,"chatHistory"),

        where("uid","==",user.uid)

    );

    const chatSnap=
    await getDocs(chatQuery);

    totalChats.textContent=
    chatSnap.size;

}

onAuthStateChanged(auth,(user)=>{

    if(user){

        loadHistory(user);

    }

    else{

        window.location.href=
        "login.html";

    }

});