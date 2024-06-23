const express = require('express')
const booksRouter = express.Router()
const {
	getAllBooks, getBookById,
	deleteBookById, createNewBook, updateBookById
} = require("../controllers/booksController.js")


booksRouter.get("/", getAllBooks)

booksRouter.get("/:id", getBookById)

booksRouter.post("/", createNewBook)

booksRouter.delete('/:id', deleteBookById)

booksRouter.put("/:id", updateBookById)



module.exports = booksRouter


