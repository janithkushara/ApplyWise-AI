const { z } = require("zod");

exports.loginSchema = z.object({
    email: z.email().trim().toLowerCase(),

    password: z.string().min(1, "Password is required")
});