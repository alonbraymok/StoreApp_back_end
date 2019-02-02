const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.Schema.Types

const UserModel = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdat: {
        type: Date,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    currentCart: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    ordersHistory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Order'
    },
    isAdmin: {
        type: Boolean,
    }
})

const Users = mongoose.model('User', UserModel) // Users needs to be the same name as the collection at the mongoDB

module.exports = Users