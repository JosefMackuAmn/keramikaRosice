const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    total: {
        type: Number,
        required: true
    },
    items: [],
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    delivery: {
        type: String,
        required: true
    },
    deliveryCost: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    paymentCost: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    isPayed: {
        type: Boolean,
        required: true
    },
    invoiceUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);