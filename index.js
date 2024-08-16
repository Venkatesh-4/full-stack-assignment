const express = require("express");
const app = express();
const port = 3001;

const crypto = require("crypto");
const JWT_SECRET = crypto.randomBytes(32).toString("hex");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const jwt = require("jsonwebtoken");

const USERS = [{ username: "venkatesh", password: "manikandan" }];

const QUESTIONS = [
  {
    title: "Two States",
    description: "Given an array, return the maximum value of the array.",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "5",
      },
    ],
  },
  {
    title: "Reverse String",
    description: "Given a string, return the string reversed.",
    testCases: [
      {
        input: '"hello"',
        output: '"olleh"',
      },
    ],
  },
  {
    title: "Palindrome Check",
    description: "Check if a given string is a palindrome.",
    testCases: [
      {
        input: '"racecar"',
        output: "true",
      },
      {
        input: '"hello"',
        output: "false",
      },
    ],
  },
];

const SUBMISSION = [];

app.get("/signup", function (req, res) {
  res.send(`
    <h2>Signup Form</h2>
    <form action="/signup" method="POST">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <label for="confirm_password">Confirm Password:</label><br>
        <input type="password" id="confirm_password" name="confirm_password" required><br><br>

        <input type="submit" value="Sign Up">
    </form>
    `);
});

app.post("/signup", function (req, res) {
  const { username, password, confirm_password } = req.body;
  const userExists = USERS.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).send("User with this username already exists.");
  }
  if (password !== confirm_password) {
    return res.status(400).send("Passwords do not match.");
  }
  USERS.push({ username, password });
  res.status(200).send("Signup successful!");
});

app.get("/login", function (req, res) {
  res.send(`
    <h2>Login Form</h2>
    <form action="/login" method="POST">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <input type="submit" value="Login">
    </form>
    `);
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;

  // Find the user by username
  const user = USERS.find((user) => user.username === username);

  // Check if user exists
  if (!user) {
    return res.status(400).send("User not found.");
  }

  // Check if the password matches
  if (user.password !== password) {
    return res.status(400).send("Incorrect password.");
  }

  // Generate a token
  const token = jwt.sign({ username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // Send the token to the client
  res.status(200).json({ message: "Login successful!", token });
});

app.get("/questions", (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Coding Questions</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h1 { color: #333; }
        h2 { color: #555; }
        p { margin: 10px 0; }
        pre { background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; }
        .question { margin-bottom: 20px; }
        .test-case { margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <h1>Coding Questions</h1>
  `;

  QUESTIONS.forEach((question) => {
    html += `
      <div class="question">
        <h2>${question.title}</h2>
        <p><strong>Description:</strong> ${question.description}</p>
    `;

    question.testCases.forEach((testCase, index) => {
      html += `
        <div class="test-case">
          <h3>Test Case ${index + 1}</h3>
          <p><strong>Input:</strong> <pre>${testCase.input}</pre></p>
          <p><strong>Output:</strong> <pre>${testCase.output}</pre></p>
        </div>
      `;
    });

    html += "</div><hr>";
  });

  html += `
    </body>
    </html>
  `;

  res.send(html);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
