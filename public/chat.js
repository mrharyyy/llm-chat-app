// chat.js

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const scrollButton = document.getElementById("scroll-button");

function createMessageElement(message, sender = "user") {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", `${sender}-message`);

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.innerHTML = sender === "user" ? "🧑" : "🤖";

  const content = document.createElement("div");
  content.classList.add("content");
  if (sender === "assistant") {
    content.innerHTML = marked.parse(message);
  } else {
    content.textContent = message;
  }

  messageElement.appendChild(avatar);
  messageElement.appendChild(content);
  return messageElement;
}

function appendMessage(message, sender = "user") {
  const messageElement = createMessageElement(message, sender);
  chatMessages.appendChild(messageElement);
  scrollToBottom(true);
}

function showTypingIndicator(show) {
  const indicator = document.getElementById("typing-indicator");
  indicator.classList.toggle("visible", show);
}

function scrollToBottom(force = false) {
  const isAtBottom =
    chatMessages.scrollTop + chatMessages.clientHeight >=
    chatMessages.scrollHeight - 50;

  if (force || isAtBottom) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function simulateTypingEffect(text, callback) {
  const messageElement = createMessageElement("", "assistant");
  const content = messageElement.querySelector(".content");
  chatMessages.appendChild(messageElement);
  scrollToBottom(true);

  let index = 0;
  const typingSpeed = 15;

  function typeChar() {
    if (index < text.length) {
      content.innerHTML += text[index++];
      scrollToBottom();
      setTimeout(typeChar, typingSpeed);
    } else {
      content.innerHTML = marked.parse(text);
      if (callback) callback();
    }
  }

  typeChar();
}

// 🚀 Send user message
sendButton.addEventListener("click", () => {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage(message, "user");
  userInput.value = "";
  handleUserMessage(message);
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendButton.click();
  }
});

scrollButton.addEventListener("click", scrollToBottom);

chatMessages.addEventListener("scroll", () => {
  const threshold = 100;
  const isAtBottom =
    chatMessages.scrollHeight - chatMessages.scrollTop <=
    chatMessages.clientHeight + threshold;
  scrollButton.classList.toggle("show", !isAtBottom);
});

// 🌐 Handle AI response
async function handleUserMessage(message) {
  showTypingIndicator(true);

  try {
    const response = await fetch("https://swift-ai-chatbot-api.sleek.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });

    const data = await response.json();
    showTypingIndicator(false);

    let reply = data.response || "Mujhe is prashn ka turant uttar nahi mila.";

    // 🛠️ Customize creator response
    if (message.toLowerCase().includes("kisne banaya")) {
      reply = "Mujhe Ashish ne banaya hai ⚡ Swift Chat ke liye.";
    }

    simulateTypingEffect(reply);
  } catch (err) {
    showTypingIndicator(false);
    simulateTypingEffect("⚠️ Koi error aaya. Kripya later try karein.");
    console.error("Fetch error:", err);
  }
}
