import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= BREVO SETUP =================
const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// ================= HOME =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CULLO Email API Running 🚀"
  });
});

// ================= SEND EMAIL =================
app.post("/send-email", async (req, res) => {
  try {
    const { to, name, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });
    }

    const email = new Brevo.SendSmtpEmail();

    email.sender = {
      name: "CULLO Movies",
      email: "noreply@cullomovies.com"
    };

    email.to = [{ email: to, name: name || "" }];
    email.subject = subject;
    email.htmlContent = html;

    await apiInstance.sendTransacEmail(email);

    res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ================= EXPORT FOR VERCEL =================
export default app;
