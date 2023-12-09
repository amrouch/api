const express = require('express');
const OrderController = require('../controllers/OrderController');
const verify = require('../Interceptor/tokenVerif');

const router = express.Router();

//Create
router.post("/", verify.verifyUser, OrderController.createOrder);

//update
router.put("/:id", verify.verifyAdmin, OrderController.updateOrder);

//Get
router.get('/:id', verify.verifyUser, OrderController.getOrder);

//Get All
router.get('/', verify.verifyUser, OrderController.getOrders);

//Get by client
router.get('/client/:id', verify.verifyAdmin, OrderController.getByClient);

//Delete
router.delete('/:id', verify.verifyAdmin, OrderController.deleteOrder);

module.exports = router;