// chat.js

// DOM Elements const chatMessages = document.getElementById("chat-messages"); const userInput = document.getElementById("user-input"); const sendButton = document.getElementById("send-button"); const typingIndicator = document.getElementById("typing-indicator"); const scrollButton = document.getElementById("scroll-button");

let chatHistory = []; let isProcessing = false;

// Auto-resize textarea userInput.addEventListener("input", function () { this.style.height = "auto"; this.style.height = this.scrollHeight + "px"; });

// Send message on Enter key userInput.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

// Send message on button click sendButton.addEventListener("click", sendMessage);

// Scroll to bottom button behavior scrollButton.addEventListener("click", () => { chatMessages.scrollTop = chatMessages.scrollHeight; });

chatMessages.addEventListener("scroll", () => { if (chatMessages.scrollTop < chatMessages.scrollHeight - chatMessages.clientHeight - 200) { scrollButton.classList.add("show"); } else { scrollButton.classList.remove("show"); } });

async function sendMessage() { const message = userInput.value.trim(); if (!message || isProcessing) return;

isProcessing = true; userInput.disabled = true; sendButton.disabled = true;

addMessage("user", message); chatHistory.push({ role: "user", content: message });

userInput.value = ""; userInput.style.height = "auto"; typingIndicator.classList.add("visible");

try { const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: chatHistory }) });

const data = await response.json();
const raw = data.result || data.response || "Sorry, no response received.";
const cleaned = cleanContent(raw);

addMessage("assistant", cleaned);
chatHistory.push({ role: "assistant", content: cleaned });

} catch (err) { console.error(err); addMessage("assistant", "❌ Sorry, something went wrong."); } finally { typingIndicator.classList.remove("visible"); isProcessing = false; userInput.disabled = false; sendButton.disabled = false; userInput.focus(); } }

function addMessage(role, content) { const message = document.createElement("div"); message.className = message ${role}-message;

const avatar = document.createElement("div"); avatar.className = "avatar"; avatar.textContent = role === "user" ? "👤" : "🤖";

const contentBox = document.createElement("div"); contentBox.className = "content"; contentBox.innerHTML = "<p></p>";

const messageText = contentBox.querySelector("p");

message.appendChild(avatar); message.appendChild(contentBox); chatMessages.appendChild(message); chatMessages.scrollTop = chatMessages.scrollHeight;

let i = 0; function typeEffect() { if (i < content.length) { messageText.innerHTML += content.charAt(i); i++; chatMessages.scrollTop = chatMessages.scrollHeight; setTimeout(typeEffect, 15); } }

if (role === "assistant") { typeEffect(); } else { messageText.textContent = content; } }

function cleanContent(content) { let cleaned = content.replace(/**(.?)**/g, '<strong>$1</strong>'); // Bold cleaned = cleaned.replace(/*(.?)*/g, '<em>$1</em>'); // Italic cleaned = cleaned.replace(/^\s*[-*] /gm, '• '); // Bullet lists return cleaned; }

