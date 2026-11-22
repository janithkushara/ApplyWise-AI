const express=require("express");
const{register,login,verifyEmail}=require("../controllers/authController");
const {validate} = require("../middleware/validatorMiddleware");
const {registerSchema} = require("../validators/authSchema");
const {verifyEmailSchema} = require("../validators/emailSchema");
const{loginSchema}=require("../validators/loginSchema")


const router=express.Router();

router.post("/register",validate(registerSchema),register);
router.post("/verify-email",validate(verifyEmailSchema),verifyEmail);
router.post("/login",validate(loginSchema),login);

module.exports=router;
