const {z}=require("zod");

const registerSchema=z.object({
    fullName:z.string().min(2),
    email:z.email(),
    password:z.string().min(15)
});

GPUShaderModule.exports={registerSchema};