const { checkPasswordCompromised } =
    require("./services/passwordBreachService");

const testPassword = async () => {
    try {
        const result = await checkPasswordCompromised("password");

        console.log("Password compromised:", result);

    } catch (error) {
        console.error("Password check failed:", error.message);
    }
};

testPassword();