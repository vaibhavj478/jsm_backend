
const express = require("express");
const { createCat  , getCat  , getCatLine, delCat ,  getCategoryByName ,  updateCategoryBasicByName , updateCategoryBannerByName ,  createProdSaveCategoryByName  ,  updateCategoryMenusName ,  deleteProd ,statusToggleProd} = require("../api/product.api");
const { updateProdTitle ,  updateProdPrice  ,  updateProdDesc , updateProdMedia} = require("../api/product.update.api");



const catRoute  = express.Router();

// creating the prodType
catRoute.post("/create-cat" , createCat);
// get cat by name || unique
catRoute.get("/cat-by-name/:name" , getCategoryByName);
catRoute.post("/cat-by-name-basic/:name" , updateCategoryBasicByName);
catRoute.post("/cat-by-name-banner/:name" , updateCategoryBannerByName);
catRoute.post("/cat-by-name-menus/:name" , updateCategoryMenusName);
// add product -- jaisalmer project 
catRoute.post("/cat-by-name-add-prod/:name" , createProdSaveCategoryByName);

// delete the product 
catRoute.post("/prod-delete/:productId" , deleteProd);

// toggle the active status of the  product 
catRoute.post("/prod-status/:productId" , statusToggleProd);


///////////////// Product update routes ///////////////////////
catRoute.post("/prod-title/:productId" , updateProdTitle );
catRoute.post("/prod-price/:productId" , updateProdPrice );
catRoute.post("/prod-desc/:productId" , updateProdDesc );
catRoute.post("/prod-media/:productId" , updateProdMedia );

///////////////// Product update routes ///////////////////////

catRoute.get("/cat" ,getCat );
catRoute.get("/cat-list" ,  getCatLine );
catRoute.delete("/del-cat/:id" ,  delCat );






module.exports =  catRoute;