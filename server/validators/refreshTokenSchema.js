const { z } = require("zod");

exports.refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required.")
});