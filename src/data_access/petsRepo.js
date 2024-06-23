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

const qryExisting = async (pet) => {
	const db = await dbConnection.connect()
	const chkExisting = `select * from pets where name = $1 and type = $2 and breed = $3`
	try {
		const result = await db.query(chkExisting, [
			pet.name,
			pet.type,
			pet.breed,
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

const createNewPetQry = async (pet) => {
	const db = await dbConnection.connect()

	try {
		const sqlQuery = `INSERT INTO pets (name, age, type, breed, has_microchip) VALUES ($1, $2, $3, $4, $5) returning *`
		const result = await db.query(sqlQuery, [
			pet.name,
			pet.age,
			pet.type,
			pet.breed,
			pet.has_microchip,
		])
		return result.rows
	} catch (e) {
		console.log(e)
		throw e
	} finally {
		db.release()
	}
}

const qryPetById = async (id) => {
	const db = await dbConnection.connect()

	try {
		const sqlQuery = `select * from pets where id = $1`
		const result = await db.query(sqlQuery, [id])
		return result.rows
	} catch (e) {
		console.log(e)
		throw e
	} finally {
		db.release()
	}
}

const updatePetByIdQry = async (id, pet) => {
	const db = await dbConnection.connect()

	try {
		const sqlQuery = `update pets set name = $1, age = $2, type = $3, breed = $4, has_microchip = $5 where id=$6 returning *`
		const result = await db.query(sqlQuery, [
			pet.name,
			pet.age,
			pet.type,
			pet.breed,
			pet.has_microchip,
			id,
		])

		return result.rows[0]
	} catch (e) {
		console.log(e)
		throw e
	} finally {
		db.release()
	}
}

const deletePetByIdQry = async (id) => {
	const db = await dbConnection.connect()

	try {
		await db.query("begin")
		const selectQry = "SELECT * FROM pets WHERE id = $1"
		const selectResult = await db.query(selectQry, [id])

		if (selectResult.rows.length === 0) {
			throw new Error("Pet not found")
		}

		const delQuery = "delete from pets where id=$1 returning *"
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
	qryAllPets,
	qryExisting,
	qryPetById,
	createNewPetQry,
	updatePetByIdQry,
	deletePetByIdQry,
}
