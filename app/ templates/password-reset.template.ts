export const passwordResetTemplate = (resetUrl:string)=>
	`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
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
    .header h1 {
      font-size: 28px;
      font-weight: 600;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin-bottom: 20px;
      font-size: 16px;
      color: #555;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .link-text {
      word-break: break-all;
      font-size: 14px;
      color: #667eea;
      margin-top: 20px;
    }
    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box strong {
      color: #856404;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      font-size: 14px;
      color: #6c757d;
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background-color: #e9ecef;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>🔒 Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset My Password</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #6c757d;">
        Or copy and paste this link into your browser:
      </p>
      <p class="link-text">${resetUrl}</p>

      <div class="warning-box">
        <strong>⚠️ Important:</strong> This link will expire in <strong>1 hour</strong>.
        If you didn't request this password reset, you can safely ignore this email.
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
        For security reasons, we recommend using a strong password that you don't use anywhere else.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply to this message.</p>
      <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;