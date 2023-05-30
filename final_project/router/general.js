const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and Password Must be provided' });
  }

  const user = users.find((user) => user.username === username);

  if (user) {
    return res.status(400).json({ message: 'User Already Exists' });
  }

  const newUser = { username, password };

  users.push(newUser);

  return res
    .status(201)
    .json({ message: 'Custormer Registered Successfully, now you can login' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ message: 'Sucess', books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `There is no book with ISBN ${isbn}`, book: null });
  }

  return res.status(300).json({ message: 'Success', book });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const bookList = [];

  for (const key in books) {
    if (books[key].author === author) {
      bookList.push({
        isbn: key,
        ...books[key],
      });
    }
  }

  if (bookList.length === 0) {
    return res.status(404).json({
      message: `There is no book writen by ${author}`,
      bookList: null,
    });
  }

  return res.status(200).json({ message: `Success`, bookList });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const bookList = [];

  for (const key in books) {
    if (books[key].title === title) {
      bookList.push({
        isbn: key,
        ...books[key],
      });
    }
  }

  if (bookList.length === 0) {
    return res.status(404).json({
      message: `There is no book under title ${title}`,
      bookList: null,
    });
  }

  return res.status(200).json({ message: `Success`, bookList });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `There is no book with ISBN ${isbn}`, reviews: null });
  }

  return res.status(200).json({ message: 'Success', reviews: book.reviews });
});

module.exports.general = public_users;
