async function getUsers() {
  const response = await fetch("/api/users", {
    method: "POST",
    body: localStorage.token,
  });
  if (response.ok) {
    const data = await response.json();
    const users = data.map(Object.values);
  } else {
    location.href = "auth.html";
  }
}

getUsers();
