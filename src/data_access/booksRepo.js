const { ExistingDataError, } = require("../errors/errors.js")
const dbConnection = require("../utils/dbConnection.js")

const qryAllBooks = async () => {
	const db = await dbConnection.connect()

	try {
		const sqlQuery = ` SELECT * from books`
		const result = await db.query(sqlQuery)

		return result.rows
	} catch (e) {
        console.log(e)
        throw e
	} finally {
		db.release()
	}
}

const qryExisting = async (book) => {
	const db = await dbConnection.connect()
	const chkExisting = `select * from books where title = $1 and publication_date = $2`
	try {
		const result = await db.query(chkExisting, [
			book.title,
			book.publication_date,
		])
		const existing = result.rows.length
		if (existing !== 0) {
			return true
		}
	} catch (e) {
        console.error(e)
	} finally {
		db.release()
	}
}

const createNewBookQry = async (book) => {
	const db = await dbConnection.connect()

	try {
		const sqlQuery = `INSERT INTO books (title, type, author, topic, publication_date, pages) VALUES ($1, $2, $3, $4, $5, $6) returning *`
		const result = await db.query(sqlQuery, [
			book.title,
			book.type,
			book.author,
			book.topic,
			book.publication_date,
			book.pages,
		])
		return result.rows
	} catch (e) {
		console.log(e)
		throw e
	} finally {
		db.release()
	}
}

const qryBookById = async (id) => {
	const db = await dbConnection.connect()

	try {
		const sqlQuery = `select * from books where id = $1`
		const result = await db.query(sqlQuery, [id])
		return result.rows
	} catch (e) {
		console.log(e)
		throw e
	} finally {
		db.release()
	}
}

const updateBookByIdQry = async (id,book) => {
	const db = await dbConnection.connect()

	try {
		const sqlQuery = `update books set title = $1, type = $2, author = $3, topic = $4, publication_date = $5, pages = $6 where id=$7 returning *`
        const result = await db.query(sqlQuery, [
			book.title,
			book.type,
			book.author,
			book.topic,
			book.publication_date,
            book.pages,
            id
		])

		return result.rows[0]
	} catch (e) {
        console.log(e)
        throw e
	} finally {
		db.release()
	}
}

const deleteBookByIdQry = async (id) => {
	const db = await dbConnection.connect()

	try {
		await db.query("begin")
		const selectQry = "SELECT * FROM books WHERE id = $1"
		const selectResult = await db.query(selectQry, [id])

		if (selectResult.rows.length === 0) {
			throw new Error("Book not found")
		}

		const delQuery = "delete from books where id=$1 returning *"
		const result = await db.query(delQuery, [id])
		await db.query("commit")
		return result.rows
	} catch (e) {
		await db.query("ROLLBACK")
		console.log(e)
		throw e
	} finally {
		db.release()
	}
}

module.exports = {
	qryAllBooks,
	qryBookById,
	qryExisting,
	deleteBookByIdQry,
	createNewBookQry,
	updateBookByIdQry,
}
