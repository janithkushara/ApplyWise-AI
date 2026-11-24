const pool=require("../db");
const {checkPasswordCompromised}=require("./passwordBreachService");
const supabase = require("../config/supabaseClient");
const supabaseAdmin = require("../config/supabaseAdmin");
const createRefreshClient = require("../config/supabaseRefreshClient");




exports.registerUser = async (userData) => {

    const { fullName, email, password } = userData;


    // Step 1: Check whether the email already exists locally
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE LOWER(email) = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        const error = new Error("An account with this email already exists.");
        error.statusCode = 409;
        throw error;
    }

    // Step 2: Check for compromised passwords
    const isCompromised = await checkPasswordCompromised(password);

    if (isCompromised === true) {
        const error = new Error("Choose a different password.");
        error.code = "PASSWORD_COMPROMISED";
        throw error;
    }

    // Step 3: Create authentication account using Supabase
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });

    if (error) {
        throw error;
    }

    if (!data.user) {
        throw new Error("Supabase did not return a user.");
    }

    // Step 4: Detect an existing confirmed Supabase account
    if (
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
    ) {
        const error = new Error(
            "An account with this email may already exist. Please log in."
        );
        error.statusCode = 409;
        throw error;
    }

    // Step 5: Save the application profile in our PostgreSQL database
    const user = await pool.query(
        `INSERT INTO users (full_name, email, supabase_uid)
         VALUES ($1, $2, $3)
         RETURNING id, full_name, email`,
        [fullName, email, data.user.id]
    );

    return {
        message: "Registration successful. Please check your email for the verification code.",
        email: email,
        user: user.rows[0]
    };
};

exports.verifyEmailOtp = async ({ email, token }) => {

    // Step 1: Ask Supabase to verify the OTP
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: "email"
    });

    if (error) {
        const authError = new Error(
            error.status === 429
                ? "Too many verification attempts. Please try again later."
                : "Invalid or expired verification code."
        );

        authError.statusCode = Number(error.status) || 400;
        throw authError;
    }

    if (!data.user) {
        const error = new Error("Email verification failed.");
        error.statusCode = 400;
        throw error;
    }

    // Step 2: Mark the local ApplyWise profile as verified
    const result = await pool.query(
        `UPDATE users
         SET email_verified = TRUE,
             updated_at = NOW()
         WHERE supabase_uid = $1
         RETURNING id, full_name, email, email_verified`,
        [data.user.id]
    );

    if (result.rows.length === 0) {
        const error = new Error("User profile not found.");
        error.statusCode = 500;
        throw error;
    }

    // Step 3: Return the verified user and authentication session
    return {
        message: "Email verified successfully.",
        user: result.rows[0],
        session: data.session ? {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresIn: data.session.expires_in
        } : null
    };
};


exports.loginUser = async (userData) => {
    const { email, password } = userData;


    // Step 1: Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw error;
    }

    if (!data.session || !data.user) {
        throw new Error("Login failed.");
    }

    // Step 2: Find the local application profile
    const result = await pool.query(
        `SELECT id, full_name, email
         FROM users
         WHERE supabase_uid = $1`,
        [data.user.id]
    );

    if (result.rows.length === 0) {
        const error = new Error("User profile not found.");
        error.statusCode = 404;
        throw error;
    }

    // Step 3: Return profile and Supabase session
    return {
        message: "Login successful.",
        user: result.rows[0],
        session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
            expires_in: data.session.expires_in,
            token_type: data.session.token_type
        }
    };
};

exports.logoutUser = async (token) => {

    const { error } = await supabaseAdmin.auth.admin.signOut(
        token,
        "local"
    );

    if (error) {
        throw error;
    }

    return {
        message: "Logout successful."
    };
};

exports.refreshUserSession = async (refreshToken) => {

    const supabase = createRefreshClient();

    const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
    });

    if (error) {
        throw error;
    }

    if (!data.session || !data.user) {
        throw new Error("Unable to refresh session.");
    }

    return {
        message: "Session refreshed successfully.",
        session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
            expires_in: data.session.expires_in,
            token_type: data.session.token_type
        }
    };
};


