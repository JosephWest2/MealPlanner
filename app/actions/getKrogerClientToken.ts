"use server";

export default async function GetKrogerClientToken(clientAuthCode: string) {

    const redirectURI = "http://localhost:3000/krogerauthorize"
    const response = await fetch("https://api.kroger.com/v1/connect/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(process.env.SMITHS_CLIENT_ID + ":" + process.env.SMITHS_CLIENT_SECRET)
        },
        body: `grant_type=authorization_code&code=${clientAuthCode}&redirect_uri=${redirectURI}`
    });
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return data;

}