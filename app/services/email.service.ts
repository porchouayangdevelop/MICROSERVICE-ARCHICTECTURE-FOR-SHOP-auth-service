import nodemailer, {Transporter} from "nodemailer";
import {AppConfig} from "../configs/app.config";
import {passwordResetTemplate} from "../ templates/password-reset.template";
import {emailVerificationTemplate} from "../ templates/email-verification.template";

export class EmailService {
	
	private transporter: Transporter;
	private readonly from: string;
	private isConfigured: boolean;
	
	constructor(transporter:Transporter) {
		// @ts-ignore
		this.from = AppConfig.EMAIL_FROM;
		this.isConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER);
		
		this.transporter = transporter;
		
		if (!this.isConfigured) {
			console.log('Email service not configured. Emails will not be sent.');
			return;
		}
		
		try {
			
			this.transporter = nodemailer.createTransport({
				// @ts-ignore
				host: AppConfig.SMTP_HOST,
				port: AppConfig.SMTP_PORT,
				secure: AppConfig.SMTP_SECURE,
				auth: {
					user: AppConfig.SMTP_USER,
					pass: AppConfig.SMTP_PASSWORD
				}
			});
			this.verifyConnection().then();
		} catch (err) {
			console.log(err);
			this.isConfigured = false;
			
		}
	}
	
	
	private async verifyConnection() {
		try {
			await this.transporter.verify();
			console.log(`Email service connected successfully`)
		} catch (e: any) {
			console.log(e.message);
			this.isConfigured = false;
		}
	}
	
	async sendEmail(options: { to: string; subject: string; html: string; text?: string }) {
		if (!this.isConfigured) {
			return;
		}
		
		try {
			const info = await this.transporter.sendMail({
				from: this.from,
				to: options.to,
				subject: options.subject,
				html: options.html,
				text: options.text,
			});
			console.log(`Email service sent successfully`, {info: info});
		} catch (e: any) {
			throw e.message
		}
	}
	
	async sendPasswordResetEmail(email: string, token: string): Promise<void> {
		const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
		const html = passwordResetTemplate(resetUrl);
		
		await this.sendEmail({
			to: email,
			subject: '🔒 Password Reset Request',
			html,
			text: `Reset your password: ${resetUrl}`
		})
	}
	
	async sendEmailVerification(email: string, verifyToken: string): Promise<void> {
		const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
		const html = emailVerificationTemplate(verificationUrl);
		
		await this.sendEmail({
			to: email,
			subject: '✉️ Verify Your Email Address',
			html,
			text: `Verify your email: ${verificationUrl}`
		})
	}
	
	async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
		const html = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
          .content { padding: 40px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome Aboard!</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Welcome to our platform! We're excited to have you here.</p>
            <p>Your account has been successfully created and you can now access all features.</p>
            <p>If you have any questions, our support team is always here to help.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`;
		
		await this.sendEmail({
			to: email,
			subject: '🎉 Welcome to Our Platform!',
			html,
		})
	}
	
	async sendPasswordChangedEmail(email: string, firstName: string): Promise<void> {
		const html = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; }
          .header { background: #ff9800; color: white; padding: 40px; text-align: center; }
          .content { padding: 40px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Changed</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Your password has been successfully changed.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't make this change,
              please contact our support team immediately.
            </div>
            <p>Changed at: ${new Date().toLocaleString()}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`;
		
		await this.sendEmail({
			to: email,
			subject: '🔐 Password Changed Successfully',
			html
		})
	}
}