const express = require("express");

const { uploadCB , upload, getImages ,  delImages } = require("../middleware/imageServices");



const imageRoute = express.Router();

// creating the prodType
imageRoute.post("/upload",  upload.single('file') , uploadCB);
imageRoute.get("/get-images",  getImages);
imageRoute.post("/delete-images",  delImages);


module.exports = imageRoute;