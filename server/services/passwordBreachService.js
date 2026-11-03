const crypto = require("crypto");

exports.createSha1LookupHash=(password)=>{
   const hashP=crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
   
   return(hashP);
  
};
exports.splitHash=(hashP)=>{
       const prefix = hashP.slice(0, 5);
       const suffix = hashP.slice(5);

    return {
        prefix,
        suffix
    };
};
exports.fetchPwnedPasswordRange = async (prefix) => {

    const url = `https://api.pwnedpasswords.com/range/${prefix}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(8000),
            headers: {
                "User-Agent": "ApplyWise/1.0",
                "Add-Padding": "true"
            }
        });
        if (!response.ok) {
            const error = new Error("Password verification service unavailable");
            error.statusCode = 503;
            throw error;
        }
        const data = await response.text();

        return data;

    } catch (error) {

        if (error.statusCode === 503) {
            throw error;
        }

        const serviceError = new Error("Password verification service unavailable");
        serviceError.statusCode = 503;

        throw serviceError;
    }
};
exports.checkPasswordSuffix = (suffix, data) => {
    const lines=data.split(/\r?\n/);
   // const [hashSuffix, occurrenceCount] = line.split(":");
    const entries = lines
    .filter(line => line.trim() !== "")
    .map(line => {
        const [hashSuffix, occurrenceCount] = line.split(":");

        return {
            suffix: hashSuffix,
            count: Number(occurrenceCount)
        };
    });
    return entries.some(entry =>
    entry.suffix === suffix && entry.count > 0
    ); 

};

exports.checkPasswordCompromised = async (password) => {
     
    const hash = exports.createSha1LookupHash(password);
    const { prefix, suffix } = exports.splitHash(hash);
    const data = await exports.fetchPwnedPasswordRange(prefix);
    const result = exports.checkPasswordSuffix(suffix, data);
    return (result);
};