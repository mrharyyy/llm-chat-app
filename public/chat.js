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
    content.innerHTML = marked.parse(message); // ✅ Markdown/HTML parsing
  } else {
    content.textContent = message; // ✅ For safety, user text as plain
  }

  messageElement.appendChild(avatar);
  messageElement.appendChild(content);
  return messageElement;
}

function appendMessage(message, sender = "user") {
  const messageElement = createMessageElement(message, sender);
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

function showTypingIndicator(show) {
  const indicator = document.getElementById("typing-indicator");
  indicator.classList.toggle("visible", show);
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function simulateTypingEffect(text, callback) {
  const messageElement = createMessageElement("", "assistant");
  const content = messageElement.querySelector(".content");
  chatMessages.appendChild(messageElement);
  scrollToBottom();

  let index = 0;
  const typingSpeed = 15;

  function typeChar() {
    if (index < text.length) {
      content.innerHTML += text[index++];
      scrollToBottom();
      setTimeout(typeChar, typingSpeed);
    } else {
      content.innerHTML = marked.parse(text); // ✅ Final formatted output
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
    chatMessages.scrollHeight - chatMessages.scrollTop <=
    chatMessages.clientHeight + threshold;
  scrollButton.classList.toggle("show", !isAtBottom);
});

function handleUserMessage(message) {
  showTypingIndicator(true);

  setTimeout(() => {
    showTypingIndicator(false);

    // Dummy AI reply logic – you can replace this with your backend call
    const aiReply = `Main ek AI Assistant hoon, isliye main aapki kai tarah ki madad kar sakta hoon. Yahaan kuch udaaharan hain:

1. **Jawab dena** – Main aapke sawaalon ka jawab de sakta hoon.
2. **Jaankaari dena** – Main vibhinn vishayon par jaankaari de sakta hoon.
3. **Anuvaad karna** – Hindi se angrezi ya anya bhasha mein anuvaad.
4. **Lekh likhna** – Kisi bhi vishay par lekh ya content likhna.
5. **Sujhaav dena** – Kitabein, filmein, gaano ke sujhaav dena.
6. **Charcha karna** – Aapke vicharon par baat karna.

Toh, aap mujhe kya karne ke liye kahenge?`;

    simulateTypingEffect(aiReply);
  }, 1000);
}
