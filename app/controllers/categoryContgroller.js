const Category = require("../models/Category");
const Post = require("../models/Post");

class CategoryController {


    async createCategory(req, res) {

        try {

            const {
                name,
                description
            } = req.body;

            if (!name || !description) {

                return res.status(400).json({
                    status: false,
                    message: "Name and description are required"
                });
            }

            const existingCategory =
                await Category.findOne({
                    name: name.trim()
                });

            if (existingCategory) {

                return res.status(400).json({
                    status: false,
                    message: "Category already exists"
                });
            }

            const category = await Category.create({
                name: name.trim(),
                description: description.trim()
            });

            return res.status(201).json({

                status: true,

                message: "Category created successfully",

                category
            });

        } catch (error) {

            console.log("Create Category Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }



    async getCategories(req, res) {

        try {

            const categories = await Category.find()
                .sort({ createdAt: -1 });

            return res.status(200).json({

                status: true,

                message: "Categories fetched successfully",

                categories
            });

        } catch (error) {

            console.log("Get Categories Error:", error);

            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }



    async getCategoriesWithPosts(req, res) {

        try {

            const categories = await Category.aggregate([

                {
                    $lookup: {
                        from: "posts",
                        localField: "_id",
                        foreignField: "category",
                        as: "posts"
                    }
                },

                {
                    $addFields: {
                        totalPosts: {
                            $size: "$posts"
                        }
                    }
                },

                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        totalPosts: 1,
                        posts: 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }

            ]);

            return res.status(200).json({

                status: true,

                message:
                    "Categories with posts fetched successfully",

                categories
            });

        } catch (error) {

            console.log(
                "Get Categories With Posts Error:",
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

module.exports = new CategoryController();