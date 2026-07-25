import { translatePage }
from "./translator.js";
import {
    db,
    auth
} from "./firebase-config.js";

import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
translatePage();
// Elements
const chatBox = document.getElementById("chatBox");
const questionInput = document.getElementById("questionInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const newChatBtn = document.getElementById("newChatBtn");

let conversationHistory = [];

// --------------------
// Send Button
// --------------------

sendBtn?.addEventListener("click", sendMessage);

// --------------------
// Enter Key
// --------------------

questionInput?.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        sendMessage();

    }

});

// --------------------
// Suggested Questions
// --------------------

document.querySelectorAll(".suggestion").forEach(btn => {

    btn.addEventListener("click", () => {

        questionInput.value = btn.innerText;

        sendMessage();

    });

});

// --------------------
// New Chat
// --------------------

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

// --------------------
// User Message
// --------------------

function addUserMessage(text){

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

// --------------------
// AI Message
// --------------------

function addAIMessage(text){

    chatBox.innerHTML += `

    <div class="ai-message">

        <div class="avatar">

            🤖

        </div>

        <div class="bubble">

            ${text}

            <br><br>

            <button class="speakBtn">

                🔊 Listen

            </button>

        </div>

    </div>

    `;

}

// --------------------
// Send Message
// --------------------

async function sendMessage(){

    const question = questionInput.value.trim();

    if(!question){

        return;

    }

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

    try{

        const response = await fetch("/api/chatbot",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                userMessage:question,

                medicineName:

                localStorage.getItem("medicineName") ||

                "General",

                conversationHistory

            })

        });

        const data = await response.json();

        loading.remove();

        addAIMessage(data.reply);

        // Speak automatically

        speakReply(data.reply);

        // Listen Button

        setTimeout(()=>{

            const buttons =

            document.querySelectorAll(".speakBtn");

            const btn =

            buttons[buttons.length-1];

            btn.onclick=()=>{

                speakReply(data.reply);

            };

        },100);

        // Save Chat

        if(auth.currentUser){

            await addDoc(

                collection(db,"chatHistory"),

                {

                    uid:auth.currentUser.uid,

                    medicineName:

                    localStorage.getItem("medicineName") ||

                    "General",

                    userMessage:question,

                    aiReply:data.reply,

                    createdAt:serverTimestamp()

                }

            );

        }

        conversationHistory.push({

            role:"user",

            text:question

        });

        conversationHistory.push({

            role:"assistant",

            text:data.reply

        });

        chatBox.scrollTop = chatBox.scrollHeight;

    }

    catch(error){

        loading.remove();

        addAIMessage("❌ Unable to connect. Please try again.");

        console.error(error);

    }

}

// --------------------
// Voice Input
// --------------------

const SpeechRecognition =

window.SpeechRecognition ||

window.webkitSpeechRecognition;

if(SpeechRecognition && micBtn){

    const recognition =

    new SpeechRecognition();

    recognition.lang="en-IN";

    recognition.interimResults=false;

    recognition.continuous=false;

    micBtn.addEventListener("click",()=>{

        recognition.start();

        micBtn.innerHTML="🎙️";

    });

    recognition.onresult=(event)=>{

        questionInput.value=

        event.results[0][0].transcript;

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

// --------------------
// Voice Output
// --------------------

function speakReply(text){

    if(!("speechSynthesis" in window)){

        return;

    }

    window.speechSynthesis.cancel();

    const speech =

    new SpeechSynthesisUtterance(text);

    speech.lang="en-IN";

    speech.rate=1;

    speech.pitch=1;

    speech.volume=1;

    window.speechSynthesis.speak(speech);

}