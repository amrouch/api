const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const userExist = await User.findOne({ email: req.body.email });
        console.log(userExist);
        if (userExist) {
            res.send({ message: 'user already exists, please choose another email' });
        }
        else {
            const hashedPwd = await bcrypt.hash(req.body.password, 10);
            const user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPwd
            });
            res.json(user);
        }
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const pass = bcrypt.compare(req.body.password, user.password);

            if (pass) {
                const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT);
                const { password, isAdmin, ...otherDetails } = user._doc
                res.cookie("access_token", token, {
                    httpOnly: true
                })
                    .send({ message: 'Auth Successful', ...otherDetails });

            }
            else {
                res.send({ message: "Wrong email or password" });
            }
        }
        else {
            res.send({ message: "Wrong email or password" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occured");
    }
}

module.exports = {
    register,
    login
}