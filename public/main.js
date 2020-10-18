const password = document.querySelector(".password");
const passwordConfirmInput = document.querySelector(".password-confirm");
const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector("#form");
const loginInput = document.querySelector("#loginInput");

submitBtn.addEventListener("click", () => {
  loginInput.setCustomValidity("");
  passwordConfirmInput.setCustomValidity("");
});

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
      alert("successfully registered");
      location.href = "./auth.html";
    } else {
      alert("could not register");
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
