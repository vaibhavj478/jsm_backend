const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const   moment  =  require("moment");


const companySchema = new Schema({
    name: {
      type: String,
      required: true,
    },
  
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
  companySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
  });
  
  const Company = mongoose.model('Company', companySchema);
  
  module.exports = Company;