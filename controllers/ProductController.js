const Product = require("../models/ProductModel")
const Category = require("../models/CategorieModel")

const createProduct = async (req, res, next) => {
    const { name, description, quantity, price, categorie, size, color } = req.body;

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
            size,
            color
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
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

const getByCat = async (req, res, next) => {
    const categoryId = req.params.id;
    try {
        const products = await Product.find({ categorie: categoryId });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given category ID' });
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}

const getByColor = async (req, res, next) => {
    const color = req.params.color;
    try {
        const products = await Product.find({ color });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given color' });
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}

const getBySize = async (req, res, next) => {
    const size = req.params.size;
    try {
        const products = await Product.find({ size });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given size' });
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}

const getByPrice = async (req, res, next) => {
    const { min, max } = req.params;
    try {
        const products = await Product.find({ price: { $gte: min, $lte: max } });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given price interval' });
        }

        res.status(200).json(products);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    getProducts,
    deleteProduct,
    getByCat,
    getByColor,
    getBySize,
    getByPrice
}