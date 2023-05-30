const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) =>
  users.find((user) => user.username === username) === undefined ? false : true;

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);

  return user.password === password;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and Password Must be provided' });
  }

  const valid = isValid(username);

  if (!valid) {
    return res.status(401).json({ message: 'User does not exits', user: null });
  }

  const authenticated = authenticatedUser(username, password);

  if (!authenticated) {
    return res.status(403).json({ message: 'Password is wrong', user: null });
  }

  const token = jwt.sign({ username, password }, 'fingerprint_customer');

  req.session.accessToken = token;

  return res.status(200).json({ message: 'Customer Loggedin Successfully' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  const bookExists = books[isbn] === undefined ? false : true;

  // if book does not exit return error
  if (!bookExists) {
    return res
      .status(404)
      .json({ message: `There is no book with ISBN ${isbn}` });
  }

  books[isbn]['reviews'][username] = review;

  return res.status(200).json({
    message: `Review of book with ISBN ${isbn} add/updated`,
  });
});

// Deleting a review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  const bookExists = books[isbn] === undefined ? false : true;

  // if book does not exit return error
  if (!bookExists) {
    return res
      .status(404)
      .json({ message: `There is no book with ISBN ${isbn}` });
  }

  if (books[isbn]['reviews'][username]) {
    delete books[isbn]['reviews'][username];
  }

  return res
    .status(200)
    .json({
      message: `Review of the book with ISBN ${isbn} for user ${username} has been deleted`,
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
