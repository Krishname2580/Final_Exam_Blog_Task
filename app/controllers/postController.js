const Post = require("../models/Post");
const Category = require("../models/Category");

class PostController {


    async createPost(req, res) {

        try {

            const {
                title,
                content,
                category,
                tags
            } = req.body;

            if (!title || !content || !category) {

                return res.status(400).json({
                    status: false,
                    message:
                        "Title, content and category are required"
                });
            }

            const categoryExists =
                await Category.findById(category);

            if (!categoryExists) {

                return res.status(404).json({
                    status: false,
                    message: "Category not found"
                });
            }

            let postTags = [];

            if (Array.isArray(tags)) {
                postTags = tags;
            } else if (typeof tags === "string") {
                postTags = tags
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag);
            }

            const post = await Post.create({

                title: title.trim(),

                content,

                category,

                tags: postTags,

            
                author: req.user._id

            });

            return res.status(201).json({

                status: true,

                message: "Post created successfully",

                post

            });

        } catch (error) {

            console.log("Create Post Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }



    async getAllPosts(req, res) {

        try {

            const posts = await Post.find()
                .sort({ createdAt: -1 });

            return res.status(200).json({

                status: true,

                message: "Posts fetched successfully",

                posts

            });

        } catch (error) {

            console.log("Get Posts Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }



    async getPostById(req, res) {

        try {

            const post = await Post.findById(
                req.params.id
            );

            if (!post) {

                return res.status(404).json({
                    status: false,
                    message: "Post not found"
                });
            }

            return res.status(200).json({

                status: true,

                message: "Post fetched successfully",

                post

            });

        } catch (error) {

            console.log("Get Post Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }


    async updatePost(req, res) {

        try {

            const {
                title,
                content,
                category,
                tags
            } = req.body;

            // Find post belonging to logged-in user
            const post = await Post.findOne({

                _id: req.params.id,

                author: req.user._id

            });

            if (!post) {

                return res.status(404).json({

                    status: false,

                    message:
                        "Post not found or you are not the author"

                });
            }

            if (category) {

                const categoryExists =
                    await Category.findById(category);

                if (!categoryExists) {

                    return res.status(404).json({
                        status: false,
                        message: "Category not found"
                    });
                }

                post.category = category;
            }

            if (title) {
                post.title = title.trim();
            }

            if (content) {
                post.content = content;
            }

            if (tags !== undefined) {

                if (Array.isArray(tags)) {

                    post.tags = tags;

                } else if (typeof tags === "string") {

                    post.tags = tags
                        .split(",")
                        .map(tag => tag.trim())
                        .filter(tag => tag);
                }
            }

            await post.save();

            return res.status(200).json({

                status: true,

                message: "Post updated successfully",

                post

            });

        } catch (error) {

            console.log("Update Post Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }


    async deletePost(req, res) {

        try {

            const post =
                await Post.findOneAndDelete({

                    _id: req.params.id,

                    author: req.user._id

                });

            if (!post) {

                return res.status(404).json({

                    status: false,

                    message:
                        "Post not found or you are not the author"

                });
            }

            return res.status(200).json({

                status: true,

                message: "Post deleted successfully"

            });

        } catch (error) {

            console.log("Delete Post Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }



    async getPopularPosts(req, res) {

        try {

            const posts = await Post.find()
                .sort({
                    likes: -1
                });

            return res.status(200).json({

                status: true,

                message:
                    "Popular posts fetched successfully",

                posts

            });

        } catch (error) {

            console.log(
                "Get Popular Posts Error:",
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

module.exports = new PostController();