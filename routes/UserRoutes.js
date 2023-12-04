const express = require('express');
const UserController = require('../controllers/UserController');
const verify = require('../Interceptor/tokenVerif');
const router = express.Router();

//update
router.put("/:id", verify.verifyUser, UserController.updateUser);
//Get
router.get('/:id', verify.verifyUser, UserController.getUser);
//Get All
router.get('/', verify.verifyAdmin, UserController.getUsers);
//Delete
router.delete('/:id', verify.verifyUser, UserController.deletetUser);

module.exports = router;