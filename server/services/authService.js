const pool=require("../db");
const {checkPasswordCompromised}=require("./passwordBreachService");
const bcrypt = require("bcrypt");


exports.registerUser = async (userData) => {

    const { fullName, email, password } = userData;

    const emailLower=email.toLowerCase();
    const userExist = await pool.query(
        "SELECT id FROM users WHERE (email)=$1",
        [emailLower]
    );

    if (userExist.rows.length > 0) {
        const error = new Error("User already exists. Use another email.");
        error.statusCode = 409;
        throw error;
    }
    const result=await checkPasswordCompromised(password);
    if(result===true){
        const error = new Error("Choose a different password");
        error.code = "PASSWORD_COMPROMISED";
        throw error; 
    };
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email`,
    [fullName, emailLower, hashedPassword]
    );
    return user.rows[0];


};
    
