// ✅ FINAL chat.js using /api/chat backend endpoint

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
  content.innerHTML = sender === "assistant" ? marked.parse(message) : message;

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
    chatMessages.scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight - 50;

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
    chatMessages.scrollHeight - chatMessages.scrollTop <= chatMessages.clientHeight + threshold;
  scrollButton.classList.toggle("show", !isAtBottom);
});

// 🌐 Handle AI response from backend
async function handleUserMessage(message) {
  showTypingIndicator(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }]
      }),
    });

    const data = await response.text(); // raw stream
    showTypingIndicator(false);

    if (!data || data.includes("error")) {
      simulateTypingEffect("⚠️ Koi error aaya. Kripya later try karein.");
      return;
    }

    let reply = data;

    if (message.toLowerCase().includes("kisne banaya")) {
      reply = "Mujhe Ashish ne banaya hai ⚡ Swift Chat ke liye.";
    }

    simulateTypingEffect(reply);
  } catch (err) {
    showTypingIndicator(false);
    simulateTypingEffect("⚠️ Server se jawab nahi mila. Baad me koshish karein.");
    console.error("❌ Fetch error:", err);
  }
}
