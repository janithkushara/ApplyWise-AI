const express=require("express");
const{register,login,verifyEmail,getProfile,logout,refreshToken}=require("../controllers/authController");
const {validate} = require("../middleware/validatorMiddleware");
const {registerSchema} = require("../validators/authSchema");
const {verifyEmailSchema} = require("../validators/emailSchema");
const{loginSchema}=require("../validators/loginSchema");
const{refreshTokenSchema}=require("../validators/refreshTokenSchema");
const{protect}=require("../middleware/protect")


const router=express.Router();

router.post("/register",validate(registerSchema),register);
router.post("/verify-email",validate(verifyEmailSchema),verifyEmail);
router.post("/login",validate(loginSchema),login);
router.get("/profile", protect, getProfile);
router.post("/logout", protect, logout);
router.post("/refresh",validate(refreshTokenSchema),refreshToken);

module.exports=router;
