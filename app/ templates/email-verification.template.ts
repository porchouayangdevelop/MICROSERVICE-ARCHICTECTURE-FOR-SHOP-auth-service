export const emailVerificationTemplate  = (verificationUrl:string)=>
	`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f4f4f4;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin: 0; }
    .emoji { font-size: 48px; margin-bottom: 10px; }
    .content { padding: 40px 30px; }
    .content p { margin-bottom: 20px; font-size: 16px; color: #555; }
    .button-container { text-align: center; margin: 30px 0; }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p { font-size: 14px; color: #6c757d; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="emoji">✉️</div>
      <h1>Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Thank you for registering!</p>
      <p>Please verify your email address by clicking the button below:</p>
      
      <div class="button-container">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>

      <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
        This link will expire in <strong>24 hours</strong>.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;