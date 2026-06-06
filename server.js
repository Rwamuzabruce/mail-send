import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= BREVO =================
const apiInstance = new Brevo.TransactionalEmailsApi();

if (process.env.BREVO_API_KEY) {
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );
} else {
  console.error("❌ Missing BREVO_API_KEY");
}

// ================= HOME =================
app.get("/", (req, res) => {
  res.json({ message: "CULLO Register Email Server 🚀" });
});

// ================= REGISTER + SEND EMAIL =================
app.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email required"
      });
    }

    // ================= EMAIL TEMPLATE =================
    const emailData = new Brevo.SendSmtpEmail();

    emailData.sender = {
      name: "CULLO Movies",
      email: "noreply@cullomovies.com"
    };

    emailData.to = [{ email, name }];

    emailData.subject = "Registration Successful 🎉";

    emailData.htmlContent = `
      <div style="font-family:Arial;padding:20px;">
        <h1 style="color:#ff3d3d;">Welcome ${name} 🎬</h1>
        <p>Your registration is successful.</p>
        <p>You can now enjoy CULLO Movies.</p>

        <a href="https://cullomovies.com"
           style="display:inline-block;margin-top:20px;padding:10px 20px;background:#ff3d3d;color:white;text-decoration:none;">
          Start Watching
        </a>
      </div>
    `;

    // ================= SEND EMAIL =================
    await apiInstance.sendTransacEmail(emailData);

    res.json({
      success: true,
      message: "User registered + email sent"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
