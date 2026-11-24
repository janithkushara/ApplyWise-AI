const supabase = require("../config/supabaseClient");
const pool = require("../db");

exports.protect = async (req, res, next) => {
    try {
        // 1. Get the Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check whether the Bearer token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const error = new Error("Access denied. No token provided.");
            error.statusCode = 401;
            throw error;
        }

        // 3. Extract the actual token
        const token = authHeader.split(" ")[1];
        req.token = token;

        // 4. Ask Supabase to verify the token
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            const authError = new Error("Invalid or expired access token.");
            authError.statusCode = 401;
            throw authError;
        }
                
        const result = await pool.query(
            `SELECT id, full_name, email
             FROM users
             WHERE supabase_uid = $1`,
            [data.user.id]
        );

        if (result.rows.length === 0) {
            const profileError = new Error("User profile not found.");
            profileError.statusCode = 404;
            throw profileError;
        }

        req.user = result.rows[0];

        next();

    } catch (error) {
        next(error);
    }
};