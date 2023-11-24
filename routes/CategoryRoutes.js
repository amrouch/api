const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const verify = require('../tokenVerif');

const router = express.Router();

//Create
router.post("/", verify.verifyAdmin, CategoryController.createCat);
//update
router.put("/:id", verify.verifyAdmin, CategoryController.updateCat);
//Get
router.get('/:id', verify.verifyUser, CategoryController.getCat);
//Get All
router.get('/', verify.verifyUser, CategoryController.getCats);
//Delete
router.delete('/:id', verify.verifyAdmin, CategoryController.deleteCat);

module.exports = router;