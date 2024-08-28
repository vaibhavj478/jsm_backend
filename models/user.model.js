
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const   moment  =  require("moment");

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    default:"none"
  },
  post: {
    type: String,
    default:"none"
  },
  number: {
    type: String, // Assuming the phone number is a string
    default:"none"
  },
  villageName: {
    type: String,
    default:"none"
  },

  role: {
    type: String,
    enum: ['customer', 'admin'],
    required: true,
    default:"customer"
  },
  bills: [{
    type: Schema.Types.ObjectId,
    ref: 'Bill',
  }],
  createdAt: {
    type: Date,
    default: () => moment().utcOffset("+05:30").format(),
    required: true,
  },
  updatedAt: {
    type: Date,
    default: () => moment().utcOffset("+05:30").format(),
    required: true,
  },
});

// Update the 'updatedAt' field before saving the document
userSchema.pre('save', function (next) {
  this.updatedAt =  moment().utcOffset("+05:30").format(),
  next();
});



const User = mongoose.model('User', userSchema);

module.exports = User;
