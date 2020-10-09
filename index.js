import http from "http";
import fs from "fs";
import

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
  }
}

let users = [
  {
    name: "Mitch",
    login: "RichMond",
  },
  {
    name: "Bob",
    login: "DeNiro",
  },
];

function apiHandler(req, resp) {
  const route = req.url.slice(5);
  if (route === "users") {

    resp.end(JSON.stringify(users));
  }
}
