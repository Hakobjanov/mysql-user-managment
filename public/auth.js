const authForm = document.querySelector(".auth-form");
const authLogin = document.querySelector(".auth-login");
const authPassword = document.querySelector(".auth-password");

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
    alert("Successfully loged in");
    // const body = await response.json();
  } else {
    alert("Inccorect login and/or password");
  }
}
