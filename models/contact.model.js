const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require("moment");
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        const phoneNumber = parsePhoneNumberFromString(v);
        return phoneNumber ? phoneNumber.isValid() : false;
      },
      message: props => `${props.value} is not a valid mobile number!`
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Basic email validation
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  message: {
    type: String,
  
  },
  rating: {
    type: String,
    enum: ['1', '2', '3', '4', '5'], // Allow only '1' to '5' as string values
    
  },
  createdAt: {
    type: Date,
    default: () => moment().utcOffset("+05:30").format(),
    required: true,
  }
});



const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
