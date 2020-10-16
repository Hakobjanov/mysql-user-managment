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

  const valid = await validate(formData);
  e.target.reportValidity();
});

//checking login and compare password to confirm password
async function validate(formData) {
  const { login, password, confirm } = Object.fromEntries([
    ...formData.entries(),
  ]);

  let valid = true;
  // const [name, login, password, confirm] = formData.values();
  //console.log({ name, login, password, confirm });
  if (login) {
    if (!(await checkLoginAvailability(login))) {
      loginInput.setCustomValidity("already occupied");
      valid = false;
    }
  }

  if (password !== confirm) {
    passwordConfirmInput.setCustomValidity("does not match with password");
    valid = false;
  }

  return valid;
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
