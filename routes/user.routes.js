


const express = require("express");
const {   createUser, getUsers, searchUser} = require("../api/user.api");



const userRoute  = express.Router();

// creating the prodType
userRoute.post("/create-user" , createUser);
userRoute.get("/user" ,getUsers );
userRoute.get("/user-list" ,  getUsers );
userRoute.post("/user-search" ,  searchUser );
// catRoute.delete("/del-cat/:id" ,  delCat );






module.exports =  userRoute;