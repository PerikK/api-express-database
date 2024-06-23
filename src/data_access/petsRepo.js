const dbConnection = require("../utils/dbConnection.js")

const qryAllPets = async () => {
	const db = await dbConnection.connect()

	try {
		const sqlQuery = ` SELECT * from pets`
		const result = await db.query(sqlQuery)

		return result.rows
	} catch (e) {
		console.log(e)
		throw e
	} finally {
		db.release()
	}
}


module.exports = {
    qryAllPets
}