const User = require("../models/User");

class UserController {


    async getProfile(req, res) {

        try {

            const user = await User.findById(req.user._id)
                .select("-password -verificationToken");

            if (!user) {

                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({

                status: true,

                message: "Profile fetched successfully",

                user

            });

        } catch (error) {

            console.log("Get Profile Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }



    async updateProfile(req, res) {

        try {

            const {
                name,
                bio
            } = req.body;

            const user = await User.findById(req.user._id);

            if (!user) {

                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            if (name) {
                user.name = name.trim();
            }

            if (bio !== undefined) {
                user.bio = bio.trim();
            }

            if (req.file) {
                user.profilePicture = req.file.filename;
            }

            await user.save();

            return res.status(200).json({

                status: true,

                message: "Profile updated successfully",

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    profilePicture: user.profilePicture
                }

            });

        } catch (error) {

            console.log("Update Profile Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }
}

module.exports = new UserController();