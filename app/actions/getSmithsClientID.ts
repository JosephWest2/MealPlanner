"use server";

export default async function GetSmithsClientID() {
    return process.env.SMITHS_CLIENT_ID;
}