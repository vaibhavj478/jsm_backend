



const express = require("express");
const { createProductType, getProductType, delProductType   } = require("../api/product.api");



const prodTypeRoute  = express.Router();

// creating the prodType
prodTypeRoute.post("/create-product-type" , createProductType);
prodTypeRoute.get("/product-type" , getProductType);
prodTypeRoute.delete("/del-product-type/:id" , delProductType);



module.exports =  prodTypeRoute;