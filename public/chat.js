// ✅ Final updated chat.js

const chatMessages = document.getElementById("chat-messages"); const userInput = document.getElementById("user-input"); const sendButton = document.getElementById("send-button"); const scrollButton = document.getElementById("scroll-button");

function createMessageElement(message, sender = "user") { const messageElement = document.createElement("div"); messageElement.classList.add("message", ${sender}-message);

const avatar = document.createElement("div"); avatar.classList.add("avatar"); avatar.innerHTML = sender === "user" ? "🧑" : "🤖";

const content = document.createElement("div"); content.classList.add("content"); if (sender === "assistant") { content.innerHTML = marked.parse(message); } else { content.textContent = message; }

messageElement.appendChild(avatar); messageElement.appendChild(content); return messageElement; }

function appendMessage(message, sender = "user") { const messageElement = createMessageElement(message, sender); chatMessages.appendChild(messageElement); scrollToBottom(); }

function showTypingIndicator(show) { const indicator = document.getElementById("typing-indicator"); indicator.classList.toggle("visible", show); }

function scrollToBottom() { chatMessages.scrollTop = chatMessages.scrollHeight; }

function simulateTypingEffect(text, callback) { const messageElement = createMessageElement("", "assistant"); const content = messageElement.querySelector(".content"); chatMessages.appendChild(messageElement);

let index = 0; const typingSpeed = 15;

function typeChar() { if (index < text.length) { content.innerHTML += text[index++]; setTimeout(typeChar, typingSpeed); } else { content.innerHTML = marked.parse(text); if (callback) callback(); } }

typeChar(); }

sendButton.addEventListener("click", () => { const message = userInput.value.trim(); if (!message) return; appendMessage(message, "user"); userInput.value = ""; handleUserMessage(message); });

userInput.addEventListener("keypress", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendButton.click(); } });

scrollButton.addEventListener("click", scrollToBottom);

chatMessages.addEventListener("scroll", () => { const threshold = 100; const isAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop <= chatMessages.clientHeight + threshold; scrollButton.classList.toggle("show", !isAtBottom); });

function handleUserMessage(message) { showTypingIndicator(true);

fetch("https://swift-chat.pages.dev", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) }) .then((res) => res.json()) .then((data) => { showTypingIndicator(false);

let reply = data.reply || "Maaf kijiye, mujhe kuchh samajh nahi aaya.";

  if (/tum.*(banaya|creator|kisne banaya)/i.test(message)) {
    reply = "Mujhe Ashish ne banaya hai 🤖✨";
  }

  simulateTypingEffect(reply);
})
.catch((err) => {
  showTypingIndicator(false);
  console.error("Error:", err);
  simulateTypingEffect("Maaf kijiye, kuch galat ho gaya.");
});

}

