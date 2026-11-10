const {z}=require("zod");

const registerSchema=z.object({
    fullName: z.string().min(2).trim(),
    email: z.email().trim().lowercase(),
    password:z.string().min(15).regex(/[A-Z]/, "Password must contain an uppercase letter")
});

module.exports = { registerSchema };