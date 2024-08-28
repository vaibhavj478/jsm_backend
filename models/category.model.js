const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const   moment  =  require("moment");

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  nickname: {
    type: String,
   
  },
  description: {
    type: String,
   
  },
  content: {
    type: String,
   
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  level : {
    type: Number,
    required: true,
  },
  ancestors:{
    type: String,
    default:"",
  
  },

  bannerUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    },
    required: function() {
      return this.bannerType !== undefined;
    },
  },
  bannerType: {
    type: String,
    enum: ['image', 'video'],
    required: function() {
      return this.bannerUrl !== undefined;
    },
  },

  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],

  menus: {
    type: [String],
    enum: ['menu1', 'menu2'], // Only allow 'menu1' and 'menu2' as values
    default: [], // Default to an empty array if not specified
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
categorySchema.pre('save', function (next) {
  this.updatedAt =  moment().utcOffset("+05:30").format(),
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
