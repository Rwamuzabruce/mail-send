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

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#ffffff;border-radius:12px;border:1px solid #e8eaf0;">
          <tr>
            <td style="padding:48px 48px 36px;text-align:center;">

              <!-- Icon -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center">
                    <img src="https://img.icons8.com/ios11/512/40C057/ok.png"
                      width="90" height="90" alt="Success"
                      style="display:block;border:0;outline:none;text-decoration:none;" />
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <p style="margin:0 0 14px;font-size:22px;font-weight:700;color:#1e2130;line-height:1.3;">
                Account created successfully!
              </p>

              <!-- Body -->
              <p style="margin:0 0 30px;font-size:15px;color:#6b7280;line-height:1.7;">
                Congratulations <strong style="color:#374151;">${name}</strong>! Your CulloMovies account is ready.<br/>
                Start watching your favourite movies right now.
              </p>

              <!-- CTA -->
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

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #f0f2f5;padding:16px 48px;text-align:center;">
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
    emailData.subject = "Account Created - CulloMovies 🎬";
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
