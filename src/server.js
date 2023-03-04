const express = require('express')
const { createComment, getAllBooks } = require('./services')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.listen(3000)

mongoose
  .connect('mongodb://rootuser:rootpass@localhost:27017/books', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Successfully connect to MongoDB.'))
  .catch(err => console.error('Connection error', err))

app.get('/books', async (req, res) => {
  const todos = await getAllBooks()
  console.log(req.url, todos)

  res.json(todos)
})


// POST /book/:id/comment - add a new comment to a book
app.post('/book/:id/comment', async (req, res) => {
  const bookId = req.params.id;
  const commentData = req.body;

  try {
    // Find the book by ID
    const book = await Tutorial.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }

    // Create a new comment and add it to the book's comments array
    const comment = await Comment.create(commentData);

    book.comments.push(comment);

    // Save the book with the new comment
    await book.save();

    // Return the updated book object
    res.send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});
