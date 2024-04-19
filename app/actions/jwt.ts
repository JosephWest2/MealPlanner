"use server";


const crypto = require('node:crypto');

export async function VerifyJWT(jwt: string) {
    const parts = jwt.split(".");

    const hmac = crypto.createHmac("sha256", process.env.AUTH_SECRET);
    hmac.setEncoding("base64");
    hmac.update(parts[0] + "." + parts[1]);
    const digest = hmac.digest('base64');
    if (digest === parts[2]) {
        return true;
    }
    return false;
}

export async function GenerateJWT(params: { name: string, value: string }[]) {

    const hmac = crypto.createHmac("sha256", process.env.AUTH_SECRET);
    hmac.setEncoding("base64");

    const header = {
        alg: "HS256",
        typ: "JWT",
        id: crypto.randomUUID()
    }
    const payload = {
        exp: Date.now() + 10 * 60 * 1000,
        admin: true
    } as any;

    for (const param of params) {
        payload[param.name] = param.value;
    }

    let output = btoa(JSON.stringify(header)) + "." + btoa(JSON.stringify(payload))

    hmac.update(output);
    output += "." + hmac.digest("base64");
    return output;
}

export async function ReadJWT(jwt: string) {

    if (!await VerifyJWT(jwt)) {
       return null; 
    }

    const parts = jwt.split(".");

    if (parts.length < 3) {
        return null
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    return {header: header, payload: payload, signature: parts[2]}
    
}
