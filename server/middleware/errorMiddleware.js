exports.errorMiddleware=(err,req,res,next)=>{
    let statusCode=err.statusCode || 500;

    let message=statusCode<500?err.message : "internal server error"
    res.status(statusCode).json({message});
}