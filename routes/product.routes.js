const express = require("express");
const { createProdSaveCategoryByName } = require("../api/product.api");



const prodRoute  = express.Router();

// creating the Prod
prodRoute.post("/add-prod" , createProdSaveCategoryByName);









module.exports =  prodRoute;