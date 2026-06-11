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

// Simulated database - in production, use real database!
const users = new Map(); // email -> { name, password }
// Also create a name -> email lookup
const nameToEmail = new Map(); // name -> email

// Your password reset email template
function buildPasswordResetTemplate(name, tempPassword) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset - CulloMovies</title>
  <style>
    body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f3f4f6;}
    @media only screen and (max-width:560px){
      .outer{padding:16px 8px!important;}
      .card{width:100%!important;border-radius:8px!important;}
      .body-pad{padding:24px 20px 20px!important;}
      .footer-pad{padding:14px 20px!important;}
      .title{font-size:17px!important;}
      .greeting{font-size:13px!important;}
      .pwd-code{font-size:16px!important;}
      .copy-btn{padding:9px 16px!important;font-size:13px!important;}
      .login-btn{padding:11px 22px!important;font-size:13px!important;}
      .warn-text{font-size:12px!important;}
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="outer" style="padding:24px 12px;background-color:#f3f4f6;">
    <tr>
      <td align="center">
        <table role="presentation" class="card" width="480" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#ffffff;border-radius:10px;border:1px solid #e8eaf0;box-shadow:0 2px 8px rgba(0,0,0,0.07);">

          <tr>
            <td class="body-pad" style="padding:32px 36px 24px;text-align:center;">

              <!-- Lock Icon -->
              <div style="width:48px;height:48px;border-radius:50%;background-color:#fef2f2;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>

              <!-- Title -->
              <p class="title" style="margin:0 0 8px;font-size:19px;font-weight:700;color:#1e2130;">Password Reset Request</p>

              <!-- Greeting -->
              <p class="greeting" style="margin:0 0 18px;font-size:13px;color:#6b7280;line-height:1.6;">
                Hello <strong style="color:#374151;">${name}</strong>,<br/>Your password has been reset successfully.
              </p>

              <!-- Password Box -->
              <div style="background-color:#f9fafb;border-radius:8px;padding:14px;margin:0 0 14px;border:1px solid #e5e7eb;">

                <p style="margin:0 0 8px;font-size:12px;color:#6b7280;font-weight:600;display:flex;align-items:center;justify-content:center;gap:5px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="7.5" cy="15.5" r="5.5"></circle>
                    <path d="m21 2-9.6 9.6"></path>
                    <path d="m15.5 7.5 3 3L22 7l-3-3"></path>
                  </svg>
                  Your Temporary Password:
                </p>

                <div style="background-color:#ffffff;border-radius:6px;padding:10px 12px;border:1px solid #e5e7eb;margin-bottom:10px;">
                  <code id="tempPwd" class="pwd-code" style="font-size:18px;font-weight:700;color:#3b82f6;letter-spacing:1px;font-family:'Courier New',monospace;">${tempPassword}</code>
                </div>

                <button onclick="copyToClipboard()" class="copy-btn"
                  style="display:inline-flex;align-items:center;gap:6px;background-color:#3b82f6;color:#ffffff;border:none;padding:10px 18px;font-size:13px;font-weight:600;border-radius:6px;cursor:pointer;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="2" width="6" height="4" rx="1"></rect>
                    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"></path>
                    <path d="M12 11h4"></path><path d="M12 16h4"></path>
                    <path d="M8 11h.01"></path><path d="M8 16h.01"></path>
                  </svg>
                  Copy Password
                </button>

                <div id="copyMessage" style="display:none;align-items:center;justify-content:center;gap:4px;color:#10b981;font-size:12px;margin-top:8px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Password copied!
                </div>
              </div>

              <!-- Warning -->
              <div style="background-color:#fef2f2;border-left:3px solid #ef4444;border-radius:0 5px 5px 0;padding:10px 12px;margin:0 0 18px;text-align:left;display:flex;gap:7px;align-items:flex-start;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px;">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <p class="warn-text" style="margin:0;font-size:12px;color:#991b1b;line-height:1.5;">
                  <strong>Important:</strong> This is a temporary password. Please login and change it immediately.
                </p>
              </div>

              <!-- Login Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#3b82f6;border-radius:7px;">
                    <a href="https://cullomovies.com/login" target="_blank" class="login-btn"
                      style="display:inline-flex;align-items:center;gap:7px;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Login Now
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" style="border-top:1px solid #f0f2f5;padding:14px 36px;text-align:center;">
              <p style="margin:0 0 3px;font-size:11px;color:#9ca3af;">If you didn't request this, please contact support immediately.</p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">&copy; 2025 CulloMovies. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </table>
    </tr>
  </table>

  <script>
    function copyToClipboard(){
      var t=document.getElementById('tempPwd').textContent.trim();
      var m=document.getElementById('copyMessage');
      function ok(){m.style.display='flex';setTimeout(function(){m.style.display='none';},3000);}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok).catch(function(){fb(t);});}else{fb(t);}
      function fb(t){var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0;';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');ok();}catch(e){alert('Copy manually: '+t);}document.body.removeChild(ta);}
    }
  </script>
</body>
</html>`;
}

// Account creation email template
function buildEmailTemplate(name) {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Account Created - CulloMovies</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#ffffff;border-radius:12px;border:1px solid #e8eaf0;">
          <tr>
            <td style="padding:48px 48px 36px;text-align:center;">
              <img src="https://img.icons8.com/ios11/512/40C057/ok.png"
                width="90" height="90" alt="Success" />
              <p style="margin:0 0 14px;font-size:22px;font-weight:700;color:#1e2130;">
                Account created successfully!
              </p>
              <p style="margin:0 0 30px;font-size:15px;color:#6b7280;">
                Congratulations <strong>${name}</strong>! Your CulloMovies account is ready.<br/>
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
          <td style="border-top:1px solid #f0f2f5;padding:16px 48px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              &copy; 2025 CulloMovies. All rights reserved.
            </p>
          </td>
        </table>
      </table>
    </tr>
  </table>
</body>
</html>`.trim();
}

app.get("/", (req, res) => {
  res.json({ success: true, message: "CULLO Email Server 🚀" });
});

// Registration endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password required" });
    }

    // Store user in "database"
    users.set(email, { name, password });
    nameToEmail.set(name, email); // Create name -> email lookup

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

// ========== PASSWORD RESET ENDPOINT ==========
// Receives ONLY: name and password (no email needed!)
app.post("/password", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate input - ONLY name and password
    if (!name || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Name and password are required" 
      });
    }

    // Find email by name
    const email = nameToEmail.get(name);
    if (!email) {
      return res.status(404).json({ 
        success: false, 
        message: "No account found with this name" 
      });
    }

    // Get user data
    const user = users.get(email);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "No account found" 
      });
    }

    // Verify password matches
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "Incorrect password" 
      });
    }

    // Generate temporary new password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let tempPassword = '';
    for (let i = 0; i < 12; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Update password in database
    user.password = tempPassword;
    users.set(email, user);

    // Send email with temporary password
    const emailData = new Brevo.SendSmtpEmail();
    emailData.sender = { name: "CULLO Movies", email: "noreply@cullomovies.com" };
    emailData.to = [{ email, name: user.name }];
    emailData.subject = "Password Reset - Your Temporary Password 🔐";
    emailData.htmlContent = buildPasswordResetTemplate(user.name, tempPassword);

    await apiInstance.sendTransacEmail(emailData);

    res.json({ 
      success: true, 
      message: "Password has been reset. A temporary password has been sent to your email with a copy button for easy copying." 
    });

  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
