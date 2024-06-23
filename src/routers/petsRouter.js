const express = require("express")
const petsRouter = express.Router()
const {
	getAllPets,
	getPetById,
	createNewPet,
	updatePetById,
	deletePetById,
} = require("../controllers/petsController.js")

petsRouter.get("/", getAllPets)

petsRouter.get("/:id", getPetById)

petsRouter.post("/", createNewPet)

petsRouter.put("/:id", updatePetById)

petsRouter.delete("/:id", deletePetById)

module.exports = petsRouter
