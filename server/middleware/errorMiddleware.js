exports.errorMiddleware=(err,req,res,next)=>{
    let statusCode=err.statusCode || 500;

    let message=statusCode<500?err.message : "internal server error"

    const errors = err.details
    ? err.details.map(issue => ({
        field: issue.path[0],
        message: issue.message
    }))
    : undefined;

    res.status(statusCode).json({
        message,
        errors
    });

}