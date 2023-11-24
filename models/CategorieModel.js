const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorieSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    },
});

const CategorieModel = mongoose.model('Categorie', categorieSchema);

module.exports = CategorieModel;
