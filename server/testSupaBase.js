const url = process.env.SUPABASE_URL;

async function testConnection() {
    try {
        console.log("Testing Supabase:", url);

        const response = await fetch(`${url}/auth/v1/health`);

        console.log("Status:", response.status);
        console.log("Response:", await response.text());

    } catch (error) {
        console.error("Fetch failed:", error);
        console.error("Underlying cause:", error.cause);
    }
}

require("dotenv").config();
testConnection();