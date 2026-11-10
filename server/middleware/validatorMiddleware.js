exports.validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const error = new Error("Validation failed");
            error.code = "VALIDATION_ERROR";
            error.details = result.error.issues;

            return next(error);
        }

        req.validatedData = result.data;
        next();
    };
};