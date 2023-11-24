const User = require("../models/UserModel")

const updateUser = async (req, res, next) => {
    try {
        const Update = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(Update);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const getUser = async (req, res, next) => {
    try {
        const getUser = await User.findById(req.params.id);
        res.json(getUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const getUsers = async (req, res, next) => {
    try {
        const getAllUsers = await User.find({});
        res.json(getAllUsers);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const deletetUser = async (req, res, next) => {
    try {
        await User.findByIdAndRemove(req.params.id)
        res.json({ message: 'User deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}
module.exports = {
    updateUser,
    getUser,
    getUsers,
    deletetUser
}