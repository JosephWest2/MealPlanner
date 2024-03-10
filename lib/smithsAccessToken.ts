

export default async function GetSmithsAccessToken() {

    const response = await fetch("https://api-ce.kroger.com/v1/connect/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(process.env.SMITHS_CLIENT_ID + ":" + process.env.SMITHS_CLIENT_SECRET)
        },
        body: "grant_type=client_credentials",
        next: {revalidate: 1750}
    });

    if (!response.ok) {
        throw new Error("Failed to fetch Smiths token");
    }
    const data = await response.json();
    return data.access_token;

}