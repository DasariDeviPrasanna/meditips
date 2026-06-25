const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");
const conversationHistory = [];

function getMedicineName() {
  return localStorage.getItem("medicineName") || "this medicine";
}

function addBubble(text, role) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role === "user" ? "user-bubble" : "bot-bubble"}`;
  bubble.innerText = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoadingBubble() {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble bot-bubble loading-bubble";
  bubble.id = "loadingBubble";
  bubble.innerText = "Thinking...";
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingBubble() {
  const el = document.getElementById("loadingBubble");
  if (el) el.remove();
}

async function sendMessage() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  addBubble(userMessage, "user");
  conversationHistory.push({ role: "user", text: userMessage });
  addLoadingBubble();
  chatSendBtn.disabled = true;

  try {
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage,
        medicineName: getMedicineName(),
        conversationHistory: conversationHistory.slice(0, -1)
      })
    });

    const data = await response.json();
    removeLoadingBubble();
    const reply = data.reply || "Sorry, could not get a response.";
    addBubble(reply, "bot");
    conversationHistory.push({ role: "model", text: reply });

  } catch (err) {
    removeLoadingBubble();
    addBubble("Connection error. Please try again.", "bot");
  }

  chatSendBtn.disabled = false;
  chatInput.focus();
}

chatSendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});