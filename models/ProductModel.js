const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;