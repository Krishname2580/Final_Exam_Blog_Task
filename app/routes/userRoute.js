const express = require("express");

const router = express.Router();

const UserController =
    require("../controllers/userController");

const AuthCheck =
    require("../middleware/AuthCheck");

const upload =
    require("../middleware/upload");



router.get(
    "/profile",
    AuthCheck,
    UserController.getProfile
);


router.put(
    "/profileUpdate",
    AuthCheck,
    upload.single("profilePicture"),
    UserController.updateProfile
);


module.exports = router;