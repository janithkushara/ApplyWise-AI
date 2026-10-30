const express=require("express");
require("dotenv").config();

const pool=require("./db");
const app=express();

app.get("/test-db",async(req,res)=>{
    try{
        const result=await pool.query("SELECT NOW()");

        res.status(200).json({
            message:"database connected successfully",
            databaseTime:result.rows[0].now
        });
    }catch(error){
        console.error("Database connection error:",error.message);

        res.status(500).json({
            message:"database connection failed"
        });
    }
});

app.get("/applications",async(req,res)=>{
    try{
        const {userId}=req.query;
        const result=await pool.query("SELECT * FROM job_applications WHERE user_id=$1",
            [userId]
        );
        res.status(200).json(result.rows);
    }catch(error){
        res.status(500).json("invalid user id")
    }
});
const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});