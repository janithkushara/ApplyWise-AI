const{registerUser,loginUser,logoutUser,refreshUserSession}=require("../services/authService");
const { verifyEmailOtp } = require("../services/authService");

exports.register=async(req,res,next)=>{
    try{
        const userData=req.body
        const result=await registerUser(userData);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.verifyEmail=async(req,res,next)=>{
    try{
        const result=await verifyEmailOtp(req.validatedData);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.login=async(req,res,next)=>{
    try{
        const result=await loginUser(req.validatedData);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.logout = async (req, res, next) => {
    try {
        const result = await logoutUser(req.token);

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};
exports.getProfile = (req, res) => {
    res.status(200).json({
        message: "You are authenticated!",
        user: req.user
    });
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.validatedData;

        const result = await refreshUserSession(refreshToken);

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};