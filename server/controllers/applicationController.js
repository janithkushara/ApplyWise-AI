const {getApllicationById}=require("../services/applicationService");

exports.getApplication=async(req,res,next)=>{
    try{
        const userId = req.params.userId;
        const result=await getApllicationById(userId);
        res.status(200).json(result);
    }catch(error){
      next(error);
    }
};