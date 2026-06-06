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
  console.error("❌ BREVO_API_KEY missing");
}

// ================= HOME =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CULLO Register Email Server 🚀"
  });
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email required"
      });
    }

    const emailData = new Brevo.SendSmtpEmail();

    emailData.sender = {
      name: "CULLO Movies",
      email: "noreply@cullomovies.com"
    };

    emailData.to = [{ email, name }];

    emailData.subject = "Account Created - CulloMovies 🎬";

    // ================= YOUR FULL HTML TEMPLATE =================
    emailData.htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Account Created - CulloMovies</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }
  .card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 32px 28px 28px;
    text-align: center;
    width: 280px;
    backdrop-filter: blur(20px);
    animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .icon-ring {
    width: 54px; height: 54px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e8b44a, #c97d1e);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    box-shadow: 0 0 24px rgba(232,180,74,0.35);
    animation: popIn 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes popIn {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .icon-ring svg { width: 26px; height: 26px; fill: #0a0a0f; }
  h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 1px;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 8px;
    animation: fadeUp 0.5s 0.3s both;
  }
  h1 span { color: #e8b44a; }
  p {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    line-height: 1.6;
    margin-bottom: 22px;
    animation: fadeUp 0.5s 0.4s both;
  }
  .btn {
    background: linear-gradient(135deg, #e8b44a, #c97d1e);
    color: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    padding: 12px 18px;
    border-radius: 10px;
    margin-bottom: 14px;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.5s 0.5s both;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
  }
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(232,180,74,0.4);
  }
  .btn svg { width: 15px; height: 15px; fill: #0a0a0f; }
  .divider {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 12px;
    animation: fadeUp 0.5s 0.6s both;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }
  .divider span { font-size: 10px; color: rgba(255,255,255,0.2); }
  .brand {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    animation: fadeUp 0.5s 0.7s both;
  }
  .brand svg { width: 14px; height: 14px; }
  .brand-name {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 1.5px;
    font-size: 13px;
    color: rgba(255,255,255,0.35);
  }
  .brand-name span { color: #e8b44a; }
</style>
</head>

<body>
<div class="card">
  <div class="icon-ring">
    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
  </div>

  <h1>Account <span>Created</span><br>Successfully</h1>

  <p>Your account has been created successfully.<br>Start watching your favourite movies right now.</p>

  <a href="https://cullomovies.com" class="btn" target="_blank">
    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    Start Watching
  </a>

  <div class="divider"><span>your partner in entertainment</span></div>

  <div class="brand">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" fill="#e8b44a" opacity="0.2"/>
      <path d="M10 9l5 3-5 3V9z" fill="#e8b44a"/>
    </svg>
    <span class="brand-name">CULLO<span>MOVIES</span></span>
  </div>
</div>
</body>
</html>
`;

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

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
