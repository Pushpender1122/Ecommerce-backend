const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderStatus: { type: String, default: "Pending" },
    items: {
        productName: String,
        quantity: Number
    }
})
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;