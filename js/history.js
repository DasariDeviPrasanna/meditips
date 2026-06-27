import {
  db,
  auth
}
from "./firebase-config.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const historyList =
document.getElementById(
  "historyList"
);

async function loadHistory(){

const q =
query(

collection(
db,
"history"
),

where(
"uid",
"==",
auth.currentUser.uid
),

orderBy(
"scannedAt",
"desc"
)

);

const snap =
await getDocs(q);

historyList.innerHTML="";

snap.forEach(doc=>{

const data =
doc.data();

historyList.innerHTML +=

`
<div class="history-card">

<h3>

💊 ${data.medicineName}

</h3>

<p>

${data.scannedAt?.toDate().toLocaleString()}

</p>

</div>

`;

});

}

auth.onAuthStateChanged(user=>{

if(user){

loadHistory();

}

});