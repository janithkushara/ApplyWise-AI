const { request } = require("express");
const pool=require("../db");

exports.getApllicationById=async(userId)=>{

    const applicationExist=await pool.query("SELECT * FROM job_applications WHERE user_id=$1",
            [userId]);
    if(!applicationExist.rows){
        throw new Error("application not found");
    }
    return(applicationExist.rows);
}