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

const SUCCESS_ICON_BASE64 = "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";

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

        <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#ffffff;border-radius:12px;border:1px solid #e8eaf0;">
          <tr>
            <td style="padding:48px 48px 36px;text-align:center;">

              <!-- Success icon as base64 PNG — renders in ALL email clients -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center">
                    <img src="data:image/png;base64,${SUCCESS_ICON_BASE64}"
                      width="110" height="110" alt="Account created successfully"
                      style="display:block;border:0;outline:none;text-decoration:none;" />
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 14px;font-size:22px;font-weight:700;color:#1e2130;line-height:1.3;">
                Account created successfully!
              </p>

              <p style="margin:0 0 30px;font-size:15px;color:#6b7280;line-height:1.7;">
                Congratulations <strong style="color:#374151;">${name}</strong>! Your CulloMovies account is ready.<br/>
                Start watching your favourite movies right now.
              </p>

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
