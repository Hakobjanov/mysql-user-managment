import http from "http";
import fs from "fs";
import mySql from "mysql";
import bcrypt from "bcryptjs";
import { ENETRESET } from "constants";

let connection = mySql.createConnection({
  host: "db4free.net",
  user: "vagangdenagan",
  password: "123654789",
  database: "mysql_users_db",
});

connection.connect(() => {
  console.log("db connected");
});

http.createServer(handleRequest).listen(3000, () => {
  console.log("server started");
});

function handleRequest(req, resp) {
  //resp.end(fs.readFileSync("./public/index.html")); sync

  if (req.url === "/") {
    fs.readFile("./public/index.html", (err, fileData) => {
      if (err) {
        console.error(err.message);
        resp.end("404 file not found");
      } else {
        resp.end(fileData);
      }
    });
  } else if (req.url.startsWith("/api/")) {
    apiHandler(req, resp);
  } else if (req.method === "GET") {
    fs.readFile("./public" + req.url, (err, fileData) => {
      if (err) {
        console.error(err.message);
        resp.statusCode = 404;
        resp.end("404 file not found");
      } else {
        resp.end(fileData);
      }
    });
  } else {
    resp.statusCode = 400;
    resp.end("Unexpected request method and/or URL");
  }
}

function apiHandler(req, resp) {
  const route = req.url.slice(5);
  if (route === "users") {
    const sql = "SELECT * FROM users";
    connection.query(sql, (err, users) => {
      if (err) {
        console.log(err, "db error");
        resp.statusCode = 400;
        resp.end("db error");
      } else {
        resp.end(JSON.stringify(users));
      }
    });
  } else if (route.startsWith("checklogin/")) {
    const login = route.slice(11);
    const sql = `SELECT id FROM users WHERE login = "${login}"`;
    connection.query(sql, (err, users) => {
      if (err) {
        console.log(err, "db error");
        resp.statusCode = 400;
        resp.end("db error");
      } else {
        resp.end(users.length ? "false" : "true");
      }
    });
  } else if (route === "register") {
    // req.data1 => req.data2 => req.data3 => req.end
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));

      const hash = await bcrypt.hash(body.password, 4);

      const sql = `INSERT INTO users (name, login, passhash) VALUES ("${body.name}", "${body.login}", "${hash}")`;
      connection.query(sql, (err) => {
        if (err) {
          console.log(err, "db error");
          resp.statusCode = 400;
          resp.end("db error");
        } else {
          resp.end("Successfully registered!");
        }
      });
    });
  } else if (route === "auth") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));

      const sql = `SELECT passhash FROM users WHERE login = "${body.login}"`;

      connection.query(sql, async (err, data) => {
        if (err) {
          console.log(err);
        } else if (data.length) {
          const correct = await bcrypt.compare(body.password, data[0].passhash);
          if (correct) {
            resp.end("Correcto!");
          } else {
            resp.statusCode = 401;
            resp.end("Incorrect password!");
          }
        } else {
          resp.statusCode = 401;
          resp.end("User not found!");
        }
      });
    });
  } else {
    resp.statusCode = 400;
    resp.end("API not found!");
  }
}
