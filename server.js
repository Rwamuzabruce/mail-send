import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiInstance = new Brevo.TransactionalEmailsApi();

if (process.env.BREVO_API_KEY) {
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );
} else {
  console.error("❌ BREVO_API_KEY missing");
}

function buildEmailTemplate(name) {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Created - CulloMovies</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#ffffff;border-radius:12px;border:1px solid #e8eaf0;">
          <tr>
            <td style="padding:48px 48px 40px;text-align:center;">

              <!-- Confetti + icon block (SVG) -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center">
                    <svg width="110" height="110" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
                      <!-- confetti dots -->
                      <circle cx="22" cy="30" r="4" fill="#a78bfa"/>
                      <circle cx="88" cy="28" r="3" fill="#60a5fa"/>
                      <circle cx="18" cy="70" r="3" fill="#34d399"/>
                      <circle cx="92" cy="72" r="4" fill="#f59e0b"/>
                      <circle cx="38" cy="16" r="2.5" fill="#f87171"/>
                      <circle cx="74" cy="14" r="2" fill="#a78bfa"/>
                      <circle cx="55" cy="96" r="3" fill="#60a5fa"/>
                      <circle cx="30" cy="88" r="2" fill="#f59e0b"/>
                      <circle cx="82" cy="88" r="2.5" fill="#f87171"/>
                      <!-- dashes -->
                      <rect x="10" y="50" width="10" height="3" rx="1.5" fill="#e8b44a" transform="rotate(-30 10 50)"/>
                      <rect x="90" y="48" width="10" height="3" rx="1.5" fill="#e8b44a" transform="rotate(30 90 48)"/>
                      <rect x="50" y="5" width="8" height="2.5" rx="1.25" fill="#f87171" transform="rotate(60 50 5)"/>
                      <!-- curly lines -->
                      <path d="M14 42 Q8 48 14 54" stroke="#93c5fd" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                      <path d="M96 42 Q102 48 96 54" stroke="#93c5fd" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                      <!-- green circle -->
                      <circle cx="55" cy="53" r="26" fill="#4ade80"/>
                      <circle cx="55" cy="53" r="26" fill="#22c55e"/>
                      <!-- checkmark -->
                      <polyline points="43,53 51,61 67,45" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    </svg>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <p style="margin:0 0 14px;font-size:22px;font-weight:700;color:#1e2130;line-height:1.3;">
                Account created successfully!
              </p>

              <!-- Body text -->
              <p style="margin:0 0 30px;font-size:15px;color:#6b7280;line-height:1.7;max-width:360px;display:block;">
                Congratulations <strong style="color:#374151;">${name}</strong>! Your CulloMovies account is ready. Start watching your favourite movies right now.
              </p>

              <!-- CTA button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#3b82f6;border-radius:8px;">
                    <a href="https://cullomovies.com" target="_blank"
                      style="display:inline-block;padding:14px 40px;font-size:15px;
                      font-weight:700;color:#ffffff;text-decoration:none;">
                      Start Watching
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer strip -->
          <tr>
            <td style="border-top:1px solid #f0f2f5;padding:18px 48px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                You received this because you signed up on
                <a href="https://cullomovies.com" style="color:#e8b44a;text-decoration:none;font-weight:600;">CulloMovies</a>.<br/>
                &copy; 2025 CulloMovies. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}

app.get("/", (req, res) => {
  res.json({ success: true, message: "CULLO Register Email Server 🚀" });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email required" });
    }

    const emailData = new Brevo.SendSmtpEmail();
    emailData.sender = { name: "CULLO Movies", email: "noreply@cullomovies.com" };
    emailData.to = [{ email, name }];
    emailData.subject = "Welcome to CULLO Movies – Your Account is Ready";
    emailData.htmlContent = buildEmailTemplate(name);

    await apiInstance.sendTransacEmail(emailData);

    res.json({ success: true, message: "User registered + email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
