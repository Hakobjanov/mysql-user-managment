import Toaster from "./Toaster/Toaster.js";

//Toaster
const toaster = new Toaster({
  side: "bottom-left",
  // from: 'bottom',
  // to: 'right',
  // life: 1,
  limit: 10,
  width: 100,
  gap: 4,
});

const authForm = document.querySelector(".form");
const authLogin = document.querySelector(".auth-login");
const authPassword = document.querySelector(".auth-password");
const submitBtn = document.querySelector(".submit-btn");

authForm.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    reportIssues();
  }
});

authForm.addEventListener("input", (e) => {
  if (e.target.localName === "input") {
    e.target.classList[e.target.value ? "add" : "remove"]("lifted");
  }
});

submitBtn.addEventListener("click", () => reportIssues());

//authorization
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const login = authLogin.value;
  const password = authPassword.value;

  await auth(login, password);
});

async function auth(login, password) {
  const response = await fetch("/api/auth", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });

  if (response.ok) {
    localStorage.token = await response.text();
    location.href = "users.html";
    // const body = await response.json();
  } else {
    toaster.log("Inccorect login and/or password", "fail");
  }
}

function reportIssues() {
  toaster.clear();
  authForm.querySelectorAll(":invalid").forEach((input) => {
    toaster.log(`${input.name}: ${input.title}`);
  });
  authForm.classList.add("checked");
}
