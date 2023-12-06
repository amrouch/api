const User = require("../models/UserModel");
const Reset = require("../models/ResetModel");
const crypto = require('crypto');
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
            const pass = await bcrypt.compare(req.body.password, user.password);

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

const forgotPass = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        const resetPassword = new Reset({
            user: user._id,
            token,
            expiresAt,
        });
        await resetPassword.save();
        res.json({ message: 'Reset password token sent successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const resetPass = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const hashedPwd = await bcrypt.hash(newPassword, 10);
        const resetPassword = await Reset.findOne({ token });

        if (!resetPassword || resetPassword.expires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const user = await User.findById(resetPassword.user);
        user.password = hashedPwd;
        await user.save();
        await Reset.findByIdAndDelete(resetPassword._id);
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    register,
    login,
    forgotPass,
    resetPass
}