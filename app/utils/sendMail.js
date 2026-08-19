const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, token) => {

    const verificationUrl =
        `${process.env.BASE_URL}/api/verify-email/${token}`;

    await transporter.sendMail({

        from: process.env.EMAIL_FROM,

        to: email,

        subject: "Verify Your Email",

        html: `
            <h2>Welcome to Blog API</h2>

            <p>
                Thank you for creating an account.
            </p>

            <p>
                Please click the button below
                to verify your email.
            </p>

            <a href="${verificationUrl}">
                Verify Email
            </a>
        `
    });
};

module.exports = sendVerificationEmail;