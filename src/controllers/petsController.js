const {
	qryAllPets,
	qryExisting,
	qryPetById,
	createNewPetQry,
	updatePetByIdQry,
	deletePetByIdQry,
} = require("../data_access/petsRepo.js")

const {
	MissingFieldsError,
	ExistingDataError,
	DataNotFoundError,
} = require("../errors/errors.js")

const getAllPets = async (req, res, next) => {
	const pets = await qryAllPets()
	res.status(200).json({ pets })
}

const getPetById = async (req, res, next) => {
	const petId = Number(req.params.id)

	try {
		const pet = await qryPetById(petId)
		if (pet.length === 0) {
			throw new DataNotFoundError("No pet with the provided ID found")
		}
		res.status(200).json({ pet })
	} catch (e) {
		console.log(e)
		res.status(404).json({ error: e.message })
		next(e)
	}
}

const createNewPet = async (req, res, next) => {
	const pet = req.body
	const petExists = await qryExisting(pet)
	const petProps = ["name", "age", "type", "breed", "has_microchip"]

	try {
		const validInput = petProps.every((prop) => pet[prop])
		if (!validInput) {
			throw new MissingFieldsError(
				"Name, age, type, breed, has_microchip must be provided to add a new pet"
			)
		}

		if (petExists === true) {
			throw new ExistingDataError(
				"This pet is already in the database"
			)
		}

		const newPet = await createNewPetQry(pet)
		res.status(201).json({ newPet })
	} catch (e) {
		console.log(e)
		next(e)
	}
}

const updatePetById = async (req, res, next) => {
	const petId = Number(req.params.id)
	const newPetProps = req.body

	try {
		const existing = await qryPetById(petId)
		if (existing.length === 0) {
			throw new DataNotFoundError(
				"There is no pet with the provided ID"
			)
		}
		const petToUpdate = await updatePetByIdQry(petId, newPetProps)
		res.status(201).json({ "updated pet": petToUpdate })
	} catch (e) {
		console.log(e)
		next(e)
	}
}

const deletePetById = async (req, res, next) => {
	const petId = Number(req.params.id)

	try {
		const existing = await qryPetById(petId)
		if (existing.length === 0) {
			throw new DataNotFoundError(
				"There is no pet with the provided ID"
			)
		}
		const pet = await deletePetByIdQry(petId)
		res.status(201).json({ pet: pet })
	} catch (e) {
		console.log(e)
		res.status(404).json({ error: e.message })
		next(e)
	}
}

module.exports = {
	getAllPets,
	getPetById,
	createNewPet,
	updatePetById,
	deletePetById,
}
