const express = require("express");
const app = express();
const port = 3001;
app.use(express.urlencoded({ extended: true }));

// For parsing application/json (if needed)
app.use(express.json());

const USERS = [{ username: "venkatesh", password: "manikandan" }];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [];

app.get("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
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

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  // return back 200 status code to the client
});

app.post("/signup", function (req, res) {
  const { username, password, confirm_password } = req.body;

  // Check if the username already exists
  const userExists = USERS.find((user) => user.username === username);

  if (userExists) {
    return res.status(400).send("User with this username already exists.");
  }

  // Check if passwords match
  if (password !== confirm_password) {
    return res.status(400).send("Passwords do not match.");
  }

  // Store the user (for demonstration purposes, storing as plain text is not secure)
  USERS.push({ username, password });

  // Return success response
  res.status(200).send("Signup successful!");
});

app.get("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

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

  // If the username and password are correct
  res.status(200).send("Login successful!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!");
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
