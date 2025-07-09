/**
 * LLM Chat App Frontend
 *
 * Handles the chat UI interactions and communication with the backend API.
 */


  // DOM elements
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const typingIndicator = document.getElementById("typing-indicator");

// Chat state
let chatHistory = [
  {
    role: "assistant",
    content: "Hello! I'm an LLM chat app powered by Cloudflare Workers AI. How can I help you today?",
  },
];
let isProcessing = false;

// Auto-resize textarea
userInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

// Send on Enter
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Button click
sendButton.addEventListener("click", sendMessage);

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "" || isProcessing) return;

  isProcessing = true;
  userInput.disabled = true;
  sendButton.disabled = true;

  addMessageToChat("user", message);

  userInput.value = "";
  userInput.style.height = "auto";

  typingIndicator.classList.add("visible");

  chatHistory.push({ role: "user", content: message });

  try {
    const assistantMessageEl = document.createElement("div");
    assistantMessageEl.className = "message assistant-message";
    assistantMessageEl.innerHTML = "<p></p>";
    chatMessages.appendChild(assistantMessageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory }),
    });

    if (!response.ok) throw new Error("Failed to get response");

    const data = await response.json();
    const rawResponse = data.result || data.response || "";

    const cleanedResponse = cleanContent(rawResponse);

    const pTag = assistantMessageEl.querySelector("p");
    let index = 0;

    function typeWriter() {
      if (index < cleanedResponse.length) {
        pTag.innerHTML += cleanedResponse.charAt(index);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        index++;
        setTimeout(typeWriter, 20);
      }
    }

    typeWriter();

    chatHistory.push({ role: "assistant", content: cleanedResponse });

  } catch (error) {
    console.error("Error:", error);
    addMessageToChat("assistant", "Sorry, there was an error processing your request.");
  } finally {
    typingIndicator.classList.remove("visible");
    isProcessing = false;
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}

function addMessageToChat(role, content) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${role}-message`;

  const cleanedContent = content.replace(/\*/g, "");

  // For Markdown formatting (if you want lists, bold etc.)
  const htmlContent = marked.parse(cleanedContent);

  messageEl.innerHTML = "<p></p>";
  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const pTag = messageEl.querySelector("p");
  let index = 0;

  function typeWriter() {
    if (index < cleanedContent.length) {
      pTag.textContent += cleanedContent.charAt(index);
      index++;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(typeWriter, 15);
    }
  }

  if (role === "assistant") {
    typeWriter();
  } else {
    pTag.textContent = cleanedContent;
  }
}

function cleanContent(content) {
  // Remove **bold** stars and replace with <strong>
  let cleaned = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Remove *italic* stars and replace with <em>
  cleaned = cleaned.replace(/\*(.*?)\*/g, '<em>$1</em>');

  return cleaned;
}
