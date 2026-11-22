const {z}=require("zod");

exports.verifyEmailSchema = z.object({
    email: z.email().trim().toLowerCase(),
    token: z.string()
        .trim()
        .regex(/^\d{8}$/, "OTP must contain exactly 8 digits")
});