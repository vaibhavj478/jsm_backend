const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const   moment  =  require("moment");

const productSchema = new Schema({
  title:{
    type: String,
  },
  subtitle :{
    type: String,
  } ,  
  price: {
    type: String,
    required: true,
    default: '1500', // Default value for price
  },
  discountPrice: {
    type: String,
    default: '1000', 
    
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  desc1:{
    type:String,
  },
  desc2:{
    type:String,
  },
  desc3:{
    type:String,
  },
  notes :{
    type:String
  },
  isActive :{
    type:String ,
    required: true,
    enum: ['active', 'inactive'],
  },
  rating :{
    type:String ,
    enum: ['0', '1' , '1.5' , '2' , '2.5' ,  '3' ,  '3.5' ,  '4' ,  '4.5' ,  '5'],
    default: '0', 
  },
  isBuyable:{
    type:String ,
    required: true,
    enum: ['yes', 'no'],
    default: 'no', // Default value for isBuyable
  },

  media: [{
    picUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`,
      },
    },
    picType: {
      type: String,
      enum: ['image', 'video'],
    },
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
  }
});


// Create a text index on the 'nikename' field
productSchema.index({ nikename: 'text' });
// Update the 'updatedAt' field before saving the document
productSchema.pre('save', function (next) {
  this.updatedAt =  moment().utcOffset("+05:30").format(),
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
