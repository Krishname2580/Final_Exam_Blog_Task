const jwt = require("jsonwebtoken");
const User = require("../models/User");

const AuthCheck = async (req, res, next) => {
    try {

        let token =
            req.cookies?.token ||
            req.headers["authorization"] ||
            req.headers["x-access-token"];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Token is required"
            });
        }

        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid Token"
        });
    }
};

module.exports = AuthCheck;