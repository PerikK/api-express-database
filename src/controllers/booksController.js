const {
	qryAllBooks,
	createNewBookQry,
	qryBookById,
	qryExisting,
	updateBookByIdQry,
	deleteBookByIdQry,
} = require("../data_access/booksRepo.js")

const {
	MissingFieldsError,
	ExistingDataError,
	DataNotFoundError,
} = require("../errors/errors.js")

const getAllBooks = async (req, res, next) => {
	const books = await qryAllBooks()
	res.status(200).json({ books })
}

const createNewBook = async (req, res, next) => {
    const book = req.body
    const bookExists = await qryExisting(book)
	const bookProps = [
		"title",
		"type",
		"author",
		"topic",
		"publication_date",
		"pages",
	]

	try {
		const validInput = bookProps.every((prop) => book[prop])
		if (!validInput) {
			throw new MissingFieldsError(
				"Title, type, author, topic, pub_date, and number of pages must be provided to add a new book"
			)
        }        
		console.log(bookExists);
		if (bookExists === true) {
			throw new ExistingDataError(
				"This book is already in the database"
			)
        }
        
		const newBook = await createNewBookQry(book)
		res.status(201).json({ newBook })
	} catch (e) {
		console.log(e)
		next(e)
	}
}

const getBookById = async (req, res, next) => {
	const bookId = Number(req.params.id)

	try {
		const book = await qryBookById(bookId)
		if (book.length === 0) {
			throw new DataNotFoundError(
				"No book with the provided ID found"
			)
		}
		res.status(200).json({ book })
	} catch (e) {
		console.log(e)
		res.status(404).json({ error: e.message })
		next(e)
	}
}

const deleteBookById = async (req, res, next) => {
	const bookId = Number(req.params.id)

	try {
		const book = await deleteBookByIdQry(bookId)
		res.status(201).json({ book: book })
	} catch (e) {
		console.log(e)
		res.status(404).json({ error: e.message })
		next(e)
	}
}

module.exports = {
	getAllBooks,
	getBookById,
	deleteBookById,
	createNewBook,
}
