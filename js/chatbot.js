const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");

// Stores conversation history for multi-turn context
const conversationHistory = [];

// Get the scanned medicine name from localStorage
function getMedicineName() {
  return localStorage.getItem("medicineName") || "this medicine";
}

// Append a bubble to the chat window
function addBubble(text, role) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role === "user" ? "user-bubble" : "bot-bubble"}`;
  bubble.innerText = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show a loading indicator while waiting for reply
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

// Send message to /api/chatbot
async function sendMessage() {

  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Clear input, show user bubble
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
        conversationHistory: conversationHistory.slice(0, -1) // exclude latest (already sent)
      })
    });

    const data = await response.json();
    removeLoadingBubble();

    const reply = data.reply || "Sorry, I could not get a response.";
    addBubble(reply, "bot");
    conversationHistory.push({ role: "model", text: reply });

  } catch (err) {
    removeLoadingBubble();
    addBubble("⚠️ Connection error. Please check your internet and try again.", "bot");
    console.error("Chatbot fetch error:", err);
  }

  chatSendBtn.disabled = false;
  chatInput.focus();
}

// Send on button click
chatSendBtn.addEventListener("click", sendMessage);

// Send on Enter key
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
