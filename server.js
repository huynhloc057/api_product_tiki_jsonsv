const fs = require("fs");

const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const router = jsonServer.router("user.json");

const server = jsonServer.create();

const userdb = JSON.parse(fs.readFileSync("user.json", "utf-8"));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

const SECRET_KEY = "050701";

const expiresIn = "1h";

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function isAuthenticated({ email, password }) {
  return (
    userdb.users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
}

function getIndexUsername({ email, password }) {
  return userdb.users.findIndex(
    (user) => user.email === email && user.password === password
  );
}

server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

server.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (isAuthenticated({ email, password })) {
    const status = 401;
    const message = "Email & Password Already exist";
    res.status(status).json({ status, message });
    return;
  }

  fs.readFile("./user.json", (err, data) => {
    if (err) {
      const status = 401;
      const message = err;
      res.status(status).json({ status, message });
      return;
    }
    data = JSON.parse(data.toString());

    let last_item_id = data.users[data.users.length - 1].id;

    data.users.push({
      id: last_item_id + 1,
      name: name,
      email: email,
      password: password,
    });

    let writeData = fs.writeFileSync(
      "user.json",
      JSON.stringify(data),
      (err, result) => {
        if (err) {
          const status = 401;
          const message = err;
          res.status(status).json({ status, message });
          return;
        }
      }
    );
  });

  const access_token = createToken({ name, email, password });
  res.status(200).json({ access_token, name });
});

server.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!isAuthenticated({ email, password })) {
    const status = 401;
    const message = "Incorrect email or password";
    res.status(status).json({ status, message });
    return;
  }
  const access_token = createToken({ email, password });
  const index = getIndexUsername({ email, password });
  const name = userdb.users[index].name;
  res.status(200).json({ access_token, name });
});

server.use(router);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Running fake api json server");
});
