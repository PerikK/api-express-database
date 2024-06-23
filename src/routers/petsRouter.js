const express = require("express")

const petsRouter = express.Router()

const { getAllPets } = require('../controllers/petsController.js')

petsRouter.get('/', getAllPets)

module.exports = petsRouter