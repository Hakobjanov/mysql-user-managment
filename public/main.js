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

const password = document.querySelector(".password");
const passwordConfirmInput = document.querySelector(".password-confirm");
const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector("#form");
const loginInput = document.querySelector("#loginInput");
const input = document.querySelector(".input-wrapper input");

submitBtn.addEventListener("click", () => {
  loginInput.setCustomValidity("");
  passwordConfirmInput.setCustomValidity("");
});

form.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    reportIssues();
  }
});

form.addEventListener("input", (e) => {
  if (e.target.localName === "input") {
    e.target.classList[e.target.value ? "add" : "remove"]("lifted");
  }
});

submitBtn.addEventListener("click", () => reportIssues());

// form.addEventListener

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const { name, login, password, confirm } = Object.fromEntries([
    ...formData.entries(),
  ]);

  await validate(login, password, confirm);

  if (form.checkValidity()) {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, login, password }),
    });
    if (response.ok) {
      toaster.log("successfully registered", "success");
      setTimeout(() => (location.href = "./auth.html"), 900);
    } else {
      toaster.log("could not register", "fail");
    }
  } else {
    form.reportValidity();
  }
});

//checking login and compare password to confirm password
async function validate(login, password, confirm) {
  if (login) {
    if (!(await checkLoginAvailability(login))) {
      loginInput.setCustomValidity("already occupied");
    }
  }

  if (password !== confirm) {
    passwordConfirmInput.setCustomValidity("does not match with password");
  }
}

// function checkLoginAvailability(login) {
//   return fetch("/api/checklogin/" + login)
//     .then((response) => response.text())
//     .then((answer) =>
//       answer === "true" ? true : answer === "false" ? false : null
//     );
// }

async function checkLoginAvailability(login) {
  const response = await fetch("/api/checklogin/" + login);
  const answer = await response.text();
  return eval(answer);
}

function reportIssues() {
  toaster.clear();
  form.querySelectorAll(":invalid").forEach((input) => {
    toaster.log(`${input.name}: ${input.title}`);
  });
  form.classList.add("checked");
}
