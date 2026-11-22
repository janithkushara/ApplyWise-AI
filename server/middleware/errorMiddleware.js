exports.errorMiddleware = (err, req, res, next) => {
    console.error("BACKEND ERROR:", err);
    console.error(err.stack);
    let statusCode = err.statusCode || 500;
    let message = err.statusCode
       ? err.message
       : "Internal server error";

    // PostgreSQL duplicate value
    if (err.code === "23505") {
        statusCode = 409;
        message = "A record with this value already exists.";
    }
    else if (err.code === "23503") {
    statusCode = 400;
    message = "Invalid reference provided.";
    }
    else if (err.code === "23502") {
    statusCode = 400;
    message = "A required field is missing.";
    }
    else if (err.code === "23514") {
    statusCode = 400;
    message = "Invalid value provided.";
    }
    else if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid data format provided.";
    }
    // Expired JWT
    else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    }

    // Invalid JWT
    else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    }

    // JWT not active yet
    else if (err.name === "NotBeforeError") {
    statusCode = 401;
    message = "Token is not active yet";
    }   
    else if (err.code === "VALIDATION_ERROR") {
    statusCode = 400;
    message = "Validation failed";
    }
    else if (err.code === "PASSWORD_COMPROMISED") {
    statusCode = 400;
    message = "Please choose another password.";
    }
    else if (err.code === "HIBP_UNAVAILABLE") {
    statusCode = 503;
    message = "Password verification service unavailable.";
    } 

    // Zod validation details
    const errors = err.details
        ? err.details.map(issue => ({
            field: issue.path[0],
            message: issue.message
        }))
        : undefined;

    // Send response LAST
   res.status(statusCode).json({
    success: false,
    message,
    errors
   });
};