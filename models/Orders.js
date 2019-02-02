const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderModel = new Schema({
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        required: true
    }
})

const Order = mongoose.model('Order', OrderModel)

module.exports = Order