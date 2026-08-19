const Comment = require("../models/Comment");
const Post = require("../models/Post");

class CommentController {


    async createComment(req, res) {

        try {

            const {
                post,
                comment
            } = req.body;

            if (!post || !comment) {

                return res.status(400).json({
                    status: false,
                    message: "Post ID and comment are required"
                });
            }
            const postExists =
                await Post.findById(post);

            if (!postExists) {

                return res.status(404).json({
                    status: false,
                    message: "Post not found"
                });
            }

            const newComment = await Comment.create({

                post: post,

                user: req.user._id,

                comment: comment.trim()

            });

            return res.status(201).json({

                status: true,

                message: "Comment added successfully",

                comment: newComment

            });

        } catch (error) {

            console.log("Create Comment Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }



    async getPostComments(req, res) {

        try {

            const { postId } = req.params;

            // Check post
            const postExists =
                await Post.findById(postId);

            if (!postExists) {

                return res.status(404).json({
                    status: false,
                    message: "Post not found"
                });
            }

            const comments = await Comment.find({
                post: postId
            }).sort({
                createdAt: -1
            });

            return res.status(200).json({

                status: true,

                message: "Comments fetched successfully",

                comments

            });

        } catch (error) {

            console.log(
                "Get Comments Error:",
                error
            );

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }


    async updateComment(req, res) {

        try {

            const {
                comment
            } = req.body;

            if (!comment) {

                return res.status(400).json({
                    status: false,
                    message: "Comment is required"
                });
            }

            const existingComment =
                await Comment.findOne({

                    _id: req.params.id,

                    user: req.user._id

                });

            if (!existingComment) {

                return res.status(404).json({

                    status: false,

                    message:
                        "Comment not found or you are not the owner"

                });
            }

            existingComment.comment =
                comment.trim();

            await existingComment.save();

            return res.status(200).json({

                status: true,

                message: "Comment updated successfully",

                comment: existingComment

            });

        } catch (error) {

            console.log(
                "Update Comment Error:",
                error
            );

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }



    async deleteComment(req, res) {

        try {

            // Only comment owner can delete
            const comment =
                await Comment.findOneAndDelete({

                    _id: req.params.id,

                    user: req.user._id

                });

            if (!comment) {

                return res.status(404).json({

                    status: false,

                    message:
                        "Comment not found or you are not the owner"

                });
            }

            return res.status(200).json({

                status: true,

                message: "Comment deleted successfully"

            });

        } catch (error) {

            console.log(
                "Delete Comment Error:",
                error
            );

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }
}

module.exports = new CommentController();