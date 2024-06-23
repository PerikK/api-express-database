const { qryAllPets } = require('../data_access/petsRepo.js')

const {
	MissingFieldsError,
	ExistingDataError,
	DataNotFoundError,
} = require("../errors/errors.js")

const getAllPets = async (req, res, next) => {
    const pets = await qryAllPets()
    res.status(200).json({ pets })
}

module.exports = {
    getAllPets
}