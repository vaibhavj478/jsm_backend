const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const   moment  =  require("moment");

const productTypeSchema = new Schema({
    type: {
        type: String,
        required: true,
        unique: true, // Assuming each product type should be unique
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
productTypeSchema.pre('save', function (next) {
    this.updatedAt =  moment().utcOffset("+05:30").format(),
    next();
});

const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
