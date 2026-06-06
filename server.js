import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================== HEALTH CHECK ==================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CULLO Email API Running 🚀"
  });
});

// ================== BREVO SETUP ==================
const apiInstance = new Brevo.TransactionalEmailsApi();

if (!process.env.BREVO_API_KEY) {
  console.error("❌ BREVO_API_KEY is missing in environment variables");
} else {
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );
}

// ================== SEND EMAIL ==================
app.post("/send-email", async (req, res) => {
  try {
    const { to, name, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (to, subject, html)"
      });
    }

    const email = new Brevo.SendSmtpEmail();

    email.sender = {
      name: "CULLO Movies",
      email: "noreply@cullomovies.com"
    };

    email.to = [
      {
        email: to,
        name: name || ""
      }
    ];

    email.subject = subject;
    email.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(email);

    res.json({
      success: true,
      message: "Email sent successfully",
      data: response
    });

  } catch (err) {
    console.error("EMAIL ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
