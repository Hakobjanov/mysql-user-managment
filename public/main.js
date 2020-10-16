const password = document.querySelector(".password");
const passwordConfirm = document.querySelector(".password-confirm");
const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector("#form");
const loginInInput = document.querySelector("#loginIn");

// loginInInput.setCustomValidity("Not Valid");
loginInInput.addEventListener("invalid", () => {
  loginInInput.setCustomValidity("Not Valid");
});

submitBtn.addEventListener("click", () => {
  loginInInput.setCustomValidity("");
});

form.addEventListener("submit", (e) => {
  const formData = new FormData(form);
  validate(formData);
  e.preventDefault();
});

function validate(formData) {
  const { name, login, password, confirm } = Object.fromEntries([
    ...formData.entries(),
  ]);

  // const [name, login, password, confirm] = formData.values();
  console.log({ name, login, password, confirm });

  // if (login) {
  //   checkLoginAvailability(login);
  // }
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
