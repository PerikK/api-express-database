require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

//TODO: Implement books and pets APIs using Express Modular Routers
const booksRouter = require("../src/routers/booksRouter.js")
const petsRouter = require('../src/routers/petsRouter.js')
const {
	MissingFieldsError,
	ExistingDataError,
	DataNotFoundError,
} = require("./errors/errors.js")

app.use("/books", booksRouter)
app.use('/pets', petsRouter)


app.use((error, req, res, next) => {
	if (error instanceof MissingFieldsError) {
		return res.status(400).json({ error: error.message })
	}
	if (error instanceof DataNotFoundError) {
		return res.status(404).json({ error: error.message })
	}
	if (error instanceof ExistingDataError) {
		return res.status(409).json({ error: error.message })
	}

	console.error(error)
	res.status(500).json({
		message: "Something went wrong",
	})
})

module.exports = app
