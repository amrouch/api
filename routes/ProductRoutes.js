const express = require('express');
const ProductController = require('../controllers/ProductController');
const verify = require('../Interceptor/tokenVerif');

const router = express.Router();

//Create
router.post("/", verify.verifyAdmin, ProductController.createProduct);
//update
router.put("/:id", verify.verifyAdmin, ProductController.updateProduct);
//Get
router.get('/:id', verify.verifyUser, ProductController.getProduct);
//Get All
router.get('/', verify.verifyUser, ProductController.getProducts);
//Delete
router.delete('/:id', verify.verifyAdmin, ProductController.deleteProduct);

module.exports = router;