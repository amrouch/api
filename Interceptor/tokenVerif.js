const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next("you are not logged in")
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            return next("invalid token")
        }
        req.user = user;
        next();
    })
}

const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id || req.user.isAdmin) {
            next();
        } else {
            return next("you are not authorized");
        }
    })
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return next("you are not authorized");
        }
    })
}

module.exports = {
    verifyToken,
    verifyUser,
    verifyAdmin
};