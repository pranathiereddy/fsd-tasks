const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();

app.use(express.json());

const PORT = 3000;
const JWT_SECRET = "my-secret-key";
const USERS_FILE = "./users.json";

function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(users, null, 2)
  );
}

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const users = getUsers();

  const exists = users.find(
    (u) => u.username === username
  );

  if (exists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const newUser = {
    id: Date.now(),
    username,
    password,
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({
    message: "User registered",
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = getUsers();

  const user = users.find(
    (u) =>
      u.username === username &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({ token });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
}

app.get("/users", verifyToken, (req, res) => {
  const users = getUsers();

  res.json(
    users.map((u) => ({
      id: u.id,
      username: u.username,
    }))
  );
});

app.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});