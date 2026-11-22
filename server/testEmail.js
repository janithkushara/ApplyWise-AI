require("dotenv").config();

const { sendEmail } = require("./utils/emailService");

const test = async () => {
    try {
        await sendEmail(
            "your-personal-email@gmail.com",
            "ApplyWise Test",
            "Hello! Your ApplyWise email service is working."
        );

        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
};

test();