


const express = require("express");


const contactRoute = express.Router();

const { createContact, getLast2MonthContact } = require("../api/contact.api");

// creating the prodType
contactRoute.post("/create-contact", createContact);
//get contact last 2 monthget
contactRoute.get("/get-contact", getLast2MonthContact);


module.exports = contactRoute;
