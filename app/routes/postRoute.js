const express = require("express");

const router = express.Router();

const PostController =
    require("../controllers/postController");

const AuthCheck =
    require("../middleware/AuthCheck");



router.post(
    "/createPost",
    AuthCheck,
    PostController.createPost
);



router.get(
    "/getAllPosts",
    PostController.getAllPosts
);



router.get(
    "/getPopularPosts",
    PostController.getPopularPosts
);


router.get(
    "/getPostById/:id",
    PostController.getPostById
);



router.put(
    "/updatePost/:id",
    AuthCheck,
    PostController.updatePost
);


router.delete(
    "/deletePost/:id",
    AuthCheck,
    PostController.deletePost
);


module.exports = router;