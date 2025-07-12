// theme.js

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Check and apply saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
}

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const newTheme = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
});
