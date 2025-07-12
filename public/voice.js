// voice.js

const micButton = document.getElementById("mic-button");
let recognition;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
  recognition = new SpeechRecognition();
}

if (recognition) {
  recognition.lang = "en-US"; // Change to "hi-IN" for Hindi
  recognition.continuous = false;
  recognition.interimResults = false;

  micButton.addEventListener("click", () => {
    recognition.start();
    micButton.classList.add("listening");
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value += transcript;
    userInput.focus();
  };

  recognition.onerror = (event) => {
    console.error("🎤 Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    micButton.classList.remove("listening");
  };
} else {
  micButton.disabled = true;
  micButton.title = "Speech recognition not supported";
}
