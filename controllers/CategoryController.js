const Category = require("../models/CategorieModel")

const createCat = async (req, res, next) => {
    try {
        const Create = await Category.create(req.body)
        res.json(Create);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const updateCat = async (req, res, next) => {
    try {
        const Update = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(Update);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const getCat = async (req, res, next) => {
    try {
        const getCat = await Category.findById(req.params.id);
        res.json(getCat);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const getCats = async (req, res, next) => {
    try {
        const getAllCats = await Category.find({});
        res.json(getAllCats);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const deleteCat = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}
module.exports = {
    createCat,
    updateCat,
    getCat,
    getCats,
    deleteCat
}