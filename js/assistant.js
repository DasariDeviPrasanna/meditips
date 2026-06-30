import {
    db,
    auth
} from "./firebase-config.js";

import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const chatBox = document.getElementById("chatBox");
const questionInput = document.getElementById("question");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

let conversationHistory = [];

// Send Button
sendBtn.addEventListener("click", sendMessage);

// New Chat
newChatBtn?.addEventListener("click", () => {

    conversationHistory = [];

    chatBox.innerHTML = `
        <div class="ai-message">

            <div class="avatar">🤖</div>

            <div class="bubble">

                <strong>Meditips AI</strong>

                <br><br>

                👋 Hello!

                I'm your AI Health Assistant.

                Ask me anything about medicines.

            </div>

        </div>
    `;

});

// Enter Key
questionInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        sendMessage();

    }

});

// Suggested Questions
document.querySelectorAll(".suggestion").forEach((btn) => {

    btn.addEventListener("click", () => {

        questionInput.value = btn.innerText;

        sendMessage();

    });

});

// User Bubble
function addUserMessage(text) {

    chatBox.innerHTML += `

        <div class="user-message">

            <div class="bubble">

                ${text}

            </div>

            <div class="avatar">

                👤

            </div>

        </div>

    `;

}

// AI Bubble
function addAIMessage(text) {

    chatBox.innerHTML += `

        <div class="ai-message">

            <div class="avatar">

                🤖

            </div>

            <div class="bubble">

                ${text}

            </div>

        </div>

    `;

}

async function sendMessage() {

    const question = questionInput.value.trim();

    if (!question) return;

    addUserMessage(question);

    questionInput.value = "";

    const loading = document.createElement("div");

    loading.className = "ai-message";

    loading.innerHTML = `

        <div class="avatar">

            🤖

        </div>

        <div class="bubble">

            ⏳ Thinking...

        </div>

    `;

    chatBox.appendChild(loading);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("/api/chatbot", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                userMessage: question,

                medicineName: localStorage.getItem("medicineName") || "Unknown Medicine",

                conversationHistory

            })

        });

        const data = await response.json();

        if (loading.parentNode) {

            loading.parentNode.removeChild(loading);

        }

        addAIMessage(data.reply);
        if (auth.currentUser) {

    await addDoc(

        collection(db, "chatHistory"),

        {

            uid: auth.currentUser.uid,

            medicineName:
                localStorage.getItem("medicineName") || "General",

            userMessage: question,

            aiReply: data.reply,

            createdAt: serverTimestamp()

        }

    );

}

        // Save conversation
        conversationHistory.push({

            role: "user",

            text: question

        });

        conversationHistory.push({

            role: "assistant",

            text: data.reply

        });

        chatBox.scrollTop = chatBox.scrollHeight;

    }

    catch (error) {

        if (loading.parentNode) {

            loading.parentNode.removeChild(loading);

        }

        addAIMessage("❌ Unable to connect. Please try again.");

        console.error(error);

    }

}
const micBtn =
document.getElementById("micBtn");

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(SpeechRecognition && micBtn){

const recognition =
new SpeechRecognition();

recognition.lang = "en-IN";

recognition.interimResults = false;

recognition.continuous = false;

micBtn.addEventListener("click",()=>{

recognition.start();

micBtn.innerHTML="🎙️";

});

recognition.onresult=(event)=>{

const text =
event.results[0][0].transcript;

questionInput.value=text;

sendMessage();

};

recognition.onend=()=>{

micBtn.innerHTML="🎤";

};

}else{

if(micBtn){

micBtn.style.display="none";

}

}
