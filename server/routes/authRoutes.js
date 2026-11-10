const express=require("express");
const{register}=require("../controllers/authController");
const {validate} = require("../middleware/validatorMiddleware");
const {registerSchema} = require("../validators/authSchema");

const router=express.Router();

router.post("/register",validate(registerSchema),register);

module.exports=router;
