const express = require("express");

const router = express.Router();

const CategoryController =
    require("../controllers/categoryContgroller");

const AuthCheck =
    require("../middleware/AuthCheck");


router.post(
    "/createCategory",
    AuthCheck,
    CategoryController.createCategory
);



router.get(
    "/getCategories",
    CategoryController.getCategories
);



router.get(
    "/with-posts",
    CategoryController.getCategoriesWithPosts
);


module.exports = router;