const express = require("express");

const router = express.Router();

const CommentController =
    require("../controllers/commentController");

const AuthCheck =
    require("../middleware/AuthCheck");



router.post(
    "/createComment",
    AuthCheck,
    CommentController.createComment
);



router.get(
    "/post/:postId",
    CommentController.getPostComments
);



router.put(
    "/updateComment/:id",
    AuthCheck,
    CommentController.updateComment
);


router.delete(
    "/deleteComment/:id",
    AuthCheck,
    CommentController.deleteComment
);


module.exports = router;