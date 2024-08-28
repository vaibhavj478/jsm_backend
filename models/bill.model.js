const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require("moment");

const billSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: {
        type: [{ type: Schema.Types.Mixed }],
        default: [],
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    paid: {
        type: Number,
        required: true,
        default: 0
    },

    installment: [
        {
            amount: {
                type: Number,
                required: true,
                default: 0
            },
            date: {
                type: Date,
                default: () => moment().utcOffset("+05:30").format(),
                required: true
            }
        }
    ],
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
billSchema.pre('save', function (next) {
    console.log(this);
    this.updatedAt = moment().utcOffset("+05:30").format(),
    next();
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
