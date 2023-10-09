const mongoose = require('mongoose');
require('./mongoconfig');
const ProductSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true
    },
    ProductPrice: {
        type: Number,
        required: true
    },
    img: {
        type: [String]
    },
    Description: {
        type: String
    },
    Category: {
        type: [String],
        required: true
    },
    Rating: {
        type: Number,
        default: 0,
    },
    Stock: {
        type: Number,
        default: 1
    }
})

const ProductModle = new mongoose.model('products', ProductSchema);

module.exports = ProductModle;