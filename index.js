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
    id: 1,
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
    id: 2,
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
    id: 3,
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

// const QUESTIONS = [
//   {
//     title: "Two States",
//     description: "Given an array, return the maximum value of the array.",
//     testCases: [
//       {
//         input: "[1, 2, 3, 4, 5]",
//         output: "5",
//       },
//     ],
//   },
// ];

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
      <title>Question List</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h1 { color: #333; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 10px 0; }
        a { text-decoration: none; color: #007BFF; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Question List</h1>
      <ul>
  `;

  QUESTIONS.forEach((question) => {
    html += `<li><a href="/submissions/${question.id}">${question.title}</a></li>`;
  });

  html += `
      </ul>
    </body>
    </html>
  `;

  res.send(html);
});

app.get("/submissions/:id", (req, res) => {
  const questionId = parseInt(req.params.id);
  const question = QUESTIONS.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).send("Question not found.");
  }

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Submit Solution</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h1 { color: #333; }
        pre { background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; }
        form { margin-top: 20px; }
        .test-case { margin-top: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; }
        .test-case h3 { margin: 0; color: #555; }
      </style>
    </head>
    <body>
      <h1>${question.title}</h1>
      <p><strong>Description:</strong> ${question.description}</p>
      
      <h2>Test Cases</h2>
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

  html += `
      <form action="/submissions/${question.id}" method="POST">
        <label for="code">Your Solution:</label><br>
        <textarea id="code" name="code" rows="10" cols="50" required></textarea><br><br>
        <input type="submit" value="Submit Solution">
      </form>
    </body>
    </html>
  `;

  res.send(html);
});

app.post("/submissions/:id", (req, res) => {
  const questionId = parseInt(req.params.id);
  const question = QUESTIONS.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).send("Question not found.");
  }

  const { code } = req.body;

  // Randomly accept or reject the submission
  const isAccepted = Math.random() > 0.5; // 50% chance of acceptance

  let resultHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Submission Result</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h1 { color: #333; }
        .result { padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .accepted { background-color: #d4edda; color: #155724; }
        .rejected { background-color: #f8d7da; color: #721c24; }
      </style>
    </head>
    <body>
      <h1>Submission Result</h1>
      <div class="result ${isAccepted ? "accepted" : "rejected"}">
        <h2>${isAccepted ? "Accepted!" : "Rejected!"}</h2>
        <p>Your solution has been ${isAccepted ? "accepted" : "rejected"}.</p>
      </div>
    </body>
    </html>
  `;

  res.send(resultHtml);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
