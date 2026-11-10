const{registerUser}=require("../services/authService");

exports.register=async(req,res,next)=>{
    try{
        const userData=req.body
        const result=await registerUser(userData);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};