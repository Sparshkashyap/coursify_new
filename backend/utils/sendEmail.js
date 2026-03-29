import SibApiV3Sdk from "sib-api-v3-sdk";

let apiInstance = null;

const getBrevoClient = () => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY missing in environment variables");
  }

  if (!apiInstance) {
    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  return apiInstance;
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log("Sending email to:", to);

    const api = getBrevoClient();

    const sendSmtpEmail = {
      sender: {
        email: process.env.EMAIL_FROM,
        name: "Coursify",
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      htmlContent: html,
    };

    const data = await api.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};