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
    style="padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="300" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#111116;border:1px solid rgba(255,255,255,0.09);border-radius:16px;">

          <!-- Gold top bar -->
          <tr>
            <td style="background-color:#e8b44a;height:3px;border-radius:16px 16px 0 0;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 24px 24px;text-align:center;">

              <!-- Check icon -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px;">
                <tr>
                  <td align="center" width="44" height="44"
                    style="width:44px;height:44px;background-color:#e8b44a;border-radius:50%;vertical-align:middle;">
                    <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#111116"/>
                    </svg>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <p style="margin:0 0 3px;font-size:18px;font-weight:700;color:#ffffff;
                letter-spacing:0.5px;text-transform:uppercase;line-height:1.2;">
                Account <span style="color:#e8b44a;">Created</span>
              </p>
              <p style="margin:0 0 14px;font-size:10px;color:rgba(255,255,255,0.3);
                letter-spacing:2.5px;text-transform:uppercase;">
                Successfully
              </p>

              <!-- Body text -->
              <p style="margin:0 0 20px;font-size:12px;color:rgba(255,255,255,0.5);line-height:1.75;">
                Hi <span style="color:rgba(255,255,255,0.8);font-weight:600;">${name}</span>,
                your account is ready.<br/>Start exploring thousands of movies now.
              </p>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
                <tr>
                  <td align="center" style="background-color:#e8b44a;border-radius:8px;">
                    <a href="https://cullomovies.com" target="_blank"
                      style="display:inline-block;padding:10px 24px;font-size:12px;
                      font-weight:700;color:#111116;text-decoration:none;
                      letter-spacing:0.5px;text-transform:uppercase;">
                      &#9654;&nbsp; Start Watching
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Brand -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;
                    text-align:center;font-size:11px;letter-spacing:1.5px;
                    color:rgba(255,255,255,0.22);text-transform:uppercase;">
                    CULLO<span style="color:#e8b44a;">MOVIES</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

        <!-- Footer -->
        <p style="margin:14px 0 0;font-size:10px;color:#999999;text-align:center;line-height:1.6;">
          You're receiving this because you signed up on CulloMovies.<br/>
          &copy; 2025 CulloMovies. All rights reserved.
        </p>

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
