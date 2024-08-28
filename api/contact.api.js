const Contact = require('../models/contact.model');


const moment = require("moment");



// POST /api/contact - Create a new contact
 const createContact =   async (req, res) => {
    try {
      const { name, mobile, email, message, rating } = req.body;
  
      // Create a new contact instance
      const newContact = new Contact({
        name,
        mobile,
        email,
        message,
        rating,
      });
  
      // Save the contact to the database
      const savedContact = await newContact.save();
  
      // Respond with the saved contact
      res.status(201).json(savedContact);
    } catch (error) {
      // Handle validation or other errors
      res.status(400).json({ error: error.message });
    }
  }



  // GET /api/contact/recent - Get contacts from the last 2 months
 const getLast2MonthContact=    async (req, res) => {
  try {
    // Calculate the date two months ago from now
    const twoMonthsAgo = moment().utcOffset("+05:30").subtract(2, 'months').startOf('day').toDate();

    // Query the database for contacts created in the last 2 months
    const recentContacts = await Contact.find({
      createdAt: { $gte: twoMonthsAgo }
    },'-__v -updatedAt -message');

    // Respond with the found contacts
    res.status(200).send({
      success:true,
      contacts:recentContacts,
      total:  recentContacts.length
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
}




  module.exports = {
   
    createContact,
    getLast2MonthContact,


}