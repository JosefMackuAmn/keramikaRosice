const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    subcategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: false
    },
    price: {
        type: String,
        required: true
    },
    amountInStock: {
        type: Number,
        required: true
    },
    // Two different shipping prices '0' === cheap && '1' === expensive
    // A matter of whether it fits in the envelope or box
    shippingCostId: {
        type: Number,
        required: true
    },
    images: [ String ]
})

module.exports = mongoose.model('Product', productSchema);