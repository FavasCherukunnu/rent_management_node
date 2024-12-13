import { ApiResponse } from "../utils/ApiResponse.js";
import { emailServiceOffice365 } from "../utils/emailservice.js";
import { prisma } from "../app.js";
export const ContactusSentMailController = async (req, res, next) => {
    try {
        const { email, message, name } = req.body;
        const newContactus = await prisma.contactUsModal.create({
            data: {
                email: email,
                message: message,
                name: name,
                is_read: false
            }
        });
        await emailServiceOffice365.sendMail(process.env.EMAIL_SENDER, process.env.EMAIL_SENDER, `New Message from ${name} (${email})`, `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: Arial, sans-serif; background-color: #2c2c2c; color: #ffffff; text-align: center; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background-color: #333; padding: 20px; border-radius: 8px; }
                h2 { color: #3c8ffb; }
                p { color: #b0b0b0; }
                .button { background-color: #3c8ffb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>New Message from ${name} (${email})</h2>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <p>Have questions? Ready to embark on your digital transformation journey? Let's start building the future of your business together—get in touch with us.</p>
                <p>Email: info@taqnura.com</p>
                <p>Phone: +91 8891341818</p>
                <a href="mailto:info@taqnura.com" class="button">Contact Us</a>
            </div>
        </body>
        </html>`);
        await emailServiceOffice365.sendMail(process.env.EMAIL_SENDER, email, `Hey ${name}, Ready to Unlock Your Business Potential?`, `
               <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: Arial, sans-serif; background-color: #2c2c2c; color: #ffffff; text-align: center; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background-color: #333; padding: 20px; border-radius: 8px; }
                h2 { color: #3c8ffb; }
                p { color: #b0b0b0; }
                .button { background-color: #3c8ffb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Dear ${name},</h2>
                <p>We are ready to grow your Business.</p>
                <p>Have questions? Ready to embark on your digital transformation journey? Let's start building the future of your business together—get in touch with us.</p>
                <p>Email: info@taqnura.com</p>
                <p>Phone: +91 8891341818</p>
                <a href="mailto:info@taqnura.com" class="button">Contact Us</a>
            </div>
        </body>
        </html>
            `);
        res.status(200).json(new ApiResponse(true, 200, "Mail sented successfully", {}));
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
