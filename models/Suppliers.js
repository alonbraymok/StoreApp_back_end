const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SupplierModel = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }
    
})
const Supplier = mongoose.model('Supplier', SupplierModel) // Users needs to be the same name as the collection at the mongoDB

module.exports = Supplier