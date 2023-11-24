const Product = require("../models/ProductModel")
const Category = require("../models/CategorieModel")

const createProduct = async (req, res, next) => {
    const { name, description, quantity, price, categorie } = req.body;

    try {
        const category = await Category.findById(categorie);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const newProduct = new Product({
            name,
            description,
            quantity,
            price,
            categorie: categorie,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}


const updateProduct = async (req, res, next) => {
    try {
        const Update = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(Update);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}

const getProduct = async (req, res, next) => {
    try {
        const getProduct = await Product.findById(req.params.id);
        res.json(getProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}

const getProducts = async (req, res, next) => {
    try {
        const getAllProducts = await Product.find({});
        res.json(getAllProducts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}
module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    getProducts,
    deleteProduct
}