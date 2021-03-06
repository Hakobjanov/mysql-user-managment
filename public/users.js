const userList = document.querySelector("#userList");

function getBg() {
  let color = Math.floor(Math.random() * 360);
  return `hsl(${color} 70% 80%)`;
}

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
          <li class="user"  style="background-color: ${getBg()} ;">
            <h3 class="login">
              user login is: <span>${login}</span><sup class="name">the name is: <span>${name}<span></sup>
            </h3>
          </li>
      `;
      })
      .join("");
  } else {
    location.href = "auth.html";
  }
}

getUsers();
