const express = require("express")
const petsRouter = express.Router()
const {
	getAllPets,
	getPetById,
	createNewPet,
} = require("../controllers/petsController.js")


petsRouter.get('/', getAllPets)

petsRouter.get('/:id', getPetById)

petsRouter.post('/', createNewPet)



module.exports = petsRouter