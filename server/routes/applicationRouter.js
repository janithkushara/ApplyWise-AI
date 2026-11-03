const express=require("express");
const {getApplication}=require("../controllers/applicationController");

const router=express.Router();

router.get("/:userId",getApplication);

module.exports=router;