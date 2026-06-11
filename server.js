<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - CulloMovies</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 450px;
            padding: 40px;
            animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo h1 {
            color: #667eea;
            font-size: 28px;
            margin-bottom: 5px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        button:hover {
            transform: translateY(-2px);
        }

        .message {
            margin-top: 20px;
            padding: 12px;
            border-radius: 10px;
            display: none;
        }

        .message.success {
            background: #d4edda;
            color: #155724;
            display: block;
        }

        .message.error {
            background: #f8d7da;
            color: #721c24;
            display: block;
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🎬 CulloMovies</h1>
            <p>Create Account</p>
        </div>

        <form id="registerForm">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="name" placeholder="Enter your full name" required />
            </div>

            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="email" placeholder="Enter your email" required />
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" id="password" placeholder="Create a password" required />
            </div>

            <button type="submit" id="submitBtn">Register</button>
        </form>

        <div id="message" class="message"></div>
    </div>

    <script>
        const API_URL = 'http://localhost:3000/register';

        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = document.getElementById('submitBtn');
            const messageDiv = document.getElementById('message');

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Registering...';

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    messageDiv.className = 'message success';
                    messageDiv.textContent = '✅ ' + data.message;
                    document.getElementById('registerForm').reset();
                } else {
                    messageDiv.className = 'message error';
                    messageDiv.textContent = '❌ ' + data.message;
                }
            } catch (error) {
                messageDiv.className = 'message error';
                messageDiv.textContent = '❌ Connection error. Make sure server is running.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Register';
            }
        });
    </script>
</body>
</html>
