"use server";

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "zoho",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MTC_EMAIL_ADDRESS,
        pass: process.env.MTC_EMAIL_PASSWORD
    }
});

export async function SendEmail(receivingEmail: string, pdf?: string) {

    await transporter.sendMail({
        from: process.env.MTC_EMAIL_ADDRESS,
        to: receivingEmail,
        subject: "MealToCart - Your Meals " + new Date().toDateString(),
        text: "Here are your meals!",
        attachments: pdf ? [{path: pdf, filename: "MTC Order.pdf"}] : null
    })
}