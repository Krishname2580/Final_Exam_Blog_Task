const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/profiles");
    },

    filename: (req, file, cb) => {

        const extension = path.extname(file.originalname);

        const filename =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            extension;

        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {

    const allowedExtensions =
        /jpg|jpeg|png|webp/;

    const extension =
        path.extname(file.originalname).toLowerCase();

    const isExtensionValid =
        allowedExtensions.test(extension);

    const isMimeTypeValid =
        allowedExtensions.test(file.mimetype);

    if (isExtensionValid && isMimeTypeValid) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        );
    }
};

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;