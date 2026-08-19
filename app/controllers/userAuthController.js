const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendVerificationEmail = require("../utils/sendMail");

class UserAuthController {


    async register(req, res) {

        try {

            const {
                name,
                email,
                password
            } = req.body;

            if (!name || !email || !password) {

                return res.status(400).json({
                    status: false,
                    message: "Name, email and password are required"
                });
            }
            const existingUser = await User.findOne({
                email: email.toLowerCase()
            });

            if (existingUser) {

                return res.status(400).json({
                    status: false,
                    message: "Email already registered"
                });
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            // Generate verification token
            const verificationToken =
                crypto.randomBytes(32).toString("hex");

            // Create user
            const user = await User.create({

                name,

                email: email.toLowerCase(),

                password: hashedPassword,

                verificationToken,

                isVerified: false
            });

            await sendVerificationEmail(
                user.email,
                verificationToken
            );

            return res.status(201).json({

                status: true,

                message:
                    "Signup successful. Please check your email to verify your account.",

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {

            console.log("Signup Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }

    async verifyEmail(req, res) {

        try {

            const { token } = req.params;

            if (!token) {

                return res.status(400).json({
                    status: false,
                    message: "Verification token is required"
                });
            }

            // Find user using verification token
            const user = await User.findOne({
                verificationToken: token
            });

            if (!user) {

                return res.status(400).json({
                    status: false,
                    message: "Invalid or expired verification token"
                });
            }

            // Verify user
            user.isVerified = true;

            // Remove verification token
            user.verificationToken = null;

            await user.save();

            return res.status(200).json({

                status: true,

                message:
                    "Email verified successfully. You can now login."
            });

        } catch (error) {

            console.log("Verify Email Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }


    async login(req, res) {

        try {

            const {
                email,
                password
            } = req.body;

            if (!email || !password) {

                return res.status(400).json({
                    status: false,
                    message: "Email and password are required"
                });
            }

            // Find user
            const user = await User.findOne({
                email: email.toLowerCase()
            });

            if (!user) {

                return res.status(401).json({
                    status: false,
                    message: "Invalid email or password"
                });
            }

            if (!user.isVerified) {

                return res.status(403).json({
                    status: false,
                    message:
                        "Please verify your email before login"
                });
            }

            const isPasswordCorrect =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isPasswordCorrect) {

                return res.status(401).json({
                    status: false,
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(

                {
                    id: user._id,
                    email: user.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1h"
                }
            );

            return res.status(200).json({

                status: true,

                message: "Login successful",

                token,

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    profilePicture: user.profilePicture
                }
            });

        } catch (error) {

            console.log("Login Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }
}

module.exports = new UserAuthController();