import http from "http";
import fs from "fs";
import mySql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ENETRESET } from "constants";

dotenv.config();

let connection = mySql.createConnection({
  host: "db4free.net",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "mysql_users_db",
});

connection.connect(() => {
  console.log("db connected");
});

http.createServer(handleRequest).listen(process.env.PORT || 3000, () => {
  console.log("server started");
});

function handleRequest(req, resp) {
  const end = makeEnd(resp);
  //resp.end(fs.readFileSync("./public/index.html")); sync

  if (req.url === "/") {
    fs.readFile("./public/index.html", (err, fileData) => {
      if (err) {
        end("404 file not found", 404);
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
        end("404 file not found", 404);
      } else {
        if (req.url.endsWith(".css")) {
          resp.setHeader("Content-Type", "text/css; charset=utf-8");
        } else if (req.url.endsWith(".js")) {
          resp.setHeader(
            "Content-Type",
            "application/javascript; charset=utf-8"
          );
        }
        end(fileData);
      }
    });
  } else {
    end("Unexpected request method and/or URL", 400);
  }
}

async function apiHandler(req, resp) {
  const end = makeEnd(resp);
  const route = req.url.slice(5);
  if (route.startsWith("checklogin/")) {
    const login = route.slice(11);
    const sql = `SELECT id FROM users WHERE login = "${login}"`;
    connection.query(sql, (err, users) => {
      if (err) {
        console.log(err, "db error");
        end("db error", 400);
      } else {
        end(users.length ? "false" : "true");
      }
    });
  } else if (route === "register") {
    const body = await getBody(req);

    const hash = await bcrypt.hash(body.password, 4);

    const sql = `INSERT INTO users (name, login, passhash) VALUES ("${body.name}", "${body.login}", "${hash}")`;

    {
      // connection.query(sql, (err) => {
      //   if (err) {
      //     console.log(err, "db error");
      //     resp.statusCode = 400;
      //     resp.end("db error");
      //   } else {
      //     resp.end("Successfully registered!");
      //   }
      // });
      // query(sql)
      //   .then(() => resp.end("Successfully registered!"))
      //   .catch(() => {
      //     console.log(err, "db error");
      //     resp.statusCode = 400;
      //     resp.end("db error");
      //   });
    }

    try {
      await query(sql);
      end("Successfully registered!");
    } catch (err) {
      console.log(err, "db error");

      end("db error", 400);
    }
  } else if (route === "auth") {
    const body = await getBody(req);

    const sql = `SELECT id, passhash FROM users WHERE login = "${body.login}"`;

    try {
      const data = await query(sql);

      if (!data.length) {
        return end("User not found!", 401);
      }
      const correct = await bcrypt.compare(body.password, data[0].passhash);
      if (!correct) {
        return end("Incorrect password!", 401);
      }
      let token = jwt.sign(
        { user: body.login, id: data[0].id },
        process.env.JWTKEY
      );
      end(token);
    } catch (err) {}
  } else if (route === "users") {
    const token = await getBody(req);

    try {
      await jwt.verify(token, process.env.JWTKEY);
      const sql = `SELECT name, login FROM users`;

      try {
        end(await query(sql));
      } catch (err) {
        console.log(err);
        end("db error", 400);
      }
    } catch (err) {
      end("Unauthorized request", 401);
    }
  } else {
    end("API not found!", 400);
  }
}

function makeEnd(resp) {
  return function end(msg, code) {
    if (code) {
      resp.statusCode = code;
    }
    if (typeof msg != "string" && !(msg instanceof Buffer)) {
      msg = JSON.stringify(msg);
    }
    resp.end(msg);
  };
}

//PROMISIFY REQUEST BODY
function getBody(req) {
  // req.data1 => req.data2 => req.data3 => req.end
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const dataStr = Buffer.concat(chunks).toString("utf8");
      try {
        resolve(JSON.parse(dataStr));
      } catch (error) {
        resolve(dataStr);
      }
    });
  });
}

//PROMISIFY SQL QUERY
function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
