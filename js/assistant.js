const chatBox = document.getElementById("chatBox");
const questionInput = document.getElementById("question");
const sendBtn = document.getElementById("sendBtn");

// Send Button
sendBtn.addEventListener("click", sendMessage);

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

// Add User Bubble
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

// Add AI Bubble
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

  // Thinking Bubble
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

        medicineName:
          localStorage.getItem("medicineName") || "Unknown Medicine",

        conversationHistory: []

      })

    });

    const data = await response.json();

    loading.remove();

    addAIMessage(data.reply);

    chatBox.scrollTop = chatBox.scrollHeight;

  }

  catch (error) {

    loading.remove();

    addAIMessage(
      "❌ Unable to connect. Please try again."
    );

    console.error(error);

  }

}

