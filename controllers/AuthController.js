const User = require("../models/UserModel");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAILPASS,
    },
});

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
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        user.resetToken = resetToken;
        user.resetTokenExpiration = expiresAt;
        await user.save();

        const mailOptions = {
            from: process.env.MAIL,
            to: user.email,
            subject: 'Password Reset',
            text: `your token to reset password is:" ${resetToken} "`,
        };

        await transporter.sendMail(mailOptions);

        res.send('Password reset email sent');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const resetPass = async (req, res) => {
    const { token } = req.body;
    const { newPassword } = req.body;
    const hashedPwd = await bcrypt.hash(newPassword, 10);

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(401).send('Invalid or expired token');
        }

        user.password = hashedPwd;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.send('Password reset successful');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    register,
    login,
    forgotPass,
    resetPass
}