async function getUsers() {
  const response = await fetch("/api/users", {
    method: "POST",
    body: localStorage.token,
  });
  if (response.ok) {
    const data = await response.json();
    const users = data.map(Object.values);

    const columns = ["name", "login"];
    const table = new Table("#tableContainer", {
      columns,
      users,
      header: true,
      footer: true,
    });
  } else {
    location.href = "auth.html";
  }
}

getUsers();
