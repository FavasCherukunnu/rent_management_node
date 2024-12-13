import { ConfidentialClientApplication } from '@azure/msal-node';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();
// Utility function to generate OTP
// Email Service
class EmailServiceMicrosoft365 {
    msalClient;
    constructor() {
        const msalConfig = {
            auth: {
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                authority: `${process.env.AAD_ENDPOINT}/${process.env.TENANT_ID}`,
            },
        };
        this.msalClient = new ConfidentialClientApplication(msalConfig);
    }
    // Get Access Token
    async getAccessToken() {
        try {
            const tokenResponse = await this.msalClient.acquireTokenByClientCredential({
                scopes: [`${process.env.GRAPH_ENDPOINT}/.default`],
            });
            if (!tokenResponse || !tokenResponse.accessToken) {
                throw new Error('Failed to acquire access token');
            }
            return tokenResponse.accessToken;
        }
        catch (error) {
            console.error('Error acquiring token:', error.message);
            throw new Error('Authentication failed');
        }
    }
    // Send Mail
    async sendMail(fromEmail, toEmail, subject, bodyContent) {
        try {
            const accessToken = await this.getAccessToken();
            const mail = {
                message: {
                    subject,
                    from: {
                        emailAddress: {
                            address: fromEmail,
                            name: 'Taqnura',
                        },
                    },
                    sender: {
                        emailAddress: {
                            address: fromEmail,
                            name: 'Taqnura',
                        },
                    },
                    toRecipients: [
                        {
                            emailAddress: {
                                address: toEmail,
                            },
                        },
                    ],
                    body: {
                        content: bodyContent,
                        contentType: 'html',
                    },
                },
                saveToSentItems: false, // Change to true if you want to save in Sent Items
            };
            const response = await axios.post(`${process.env.GRAPH_ENDPOINT}/v1.0/users/${fromEmail}/sendMail`, mail, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error sending email:', error.response?.data || error.message);
            throw new Error(error);
        }
    }
}
// Export an instance of EmailService
export const emailServiceOffice365 = new EmailServiceMicrosoft365();