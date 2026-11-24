require("dotenv").config();
const { createClient } =require("@supabase/supabase-js");

const createRefreshClient = () => {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            }
        }
    );
};

module.exports = createRefreshClient;