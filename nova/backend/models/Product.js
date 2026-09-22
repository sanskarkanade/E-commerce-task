const mongoose = require('mongoose');
const { CATEGORIES } = require('../config/constants');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: [120, 'Name is too long (max 120)'] },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: [2000, 'Description is too long (max 2000)'] },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    category: { type: String, required: [true, 'Category is required'], enum: { values: CATEGORIES, message: 'Category must be one of: ' + CATEGORIES.join(', ') } },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
      match: [/^https?:\/\/.+/i, 'Image must be a valid http(s) URL'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
      validate: { validator: Number.isInteger, message: 'Stock must be a whole number' },
    },
    rating: { type: Number, default: 0, min: [0, 'Rating must be between 0 and 5'], max: [5, 'Rating must be between 0 and 5'] },
    // e.g. [{ label: 'Material', value: '100% cotton' }]
    specifications: [{ _id: false, label: { type: String, trim: true }, value: { type: String, trim: true } }],
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('Product', productSchema);
