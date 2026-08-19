const express = require("express");

const router = express.Router();

const UserAuthController =
    require("../controllers/userAuthController");


// ================= USER AUTH ROUTES =================

router.post(
    "/register",
    UserAuthController.register
);


router.get(
    "/verify-email/:token",
    UserAuthController.verifyEmail
);


router.post(
    "/login",
    UserAuthController.login
);


module.exports = router;