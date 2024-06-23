const {
	qryAllPets,
	qryExisting,
	qryPetById,
	createNewPetQry,
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

module.exports = {
	getAllPets,
    getPetById,
    createNewPet
}
