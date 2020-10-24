const userList = document.querySelector("#userList");

async function getUsers() {
  const response = await fetch("/api/users", {
    method: "POST",
    body: localStorage.token,
  });
  if (response.ok) {
    const data = await response.json();
    const users = data.map(Object.values);
    console.log(users);

    userList.innerHTML = users
      .map(([name, login]) => {
        return `
          <li>
            <h3>${name}</h3>
            <p>${login}</p>
          </li>
      `;
      })
      .join("");
  } else {
    location.href = "auth.html";
  }
}

getUsers();
