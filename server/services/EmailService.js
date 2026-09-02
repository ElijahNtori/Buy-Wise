const nodemailer = require("nodemailer");
const axios = require("axios");

class EmailService {
  constructor() {
    this.transporter = null;
    this.initPromise = null;
    // Only initialize SMTP transporter if Brevo API key is not present
    if (!process.env.BREVO_API_KEY) {
      this.initPromise = this.init();
    } else {
      console.log("✉️  Brevo HTTP API email service configured");
    }
  }

  async init() {
    const host = process.env.SMTP_HOST || process.env.SMPT_HOST;
    const port = process.env.SMTP_PORT || process.env.SMPT_PORT;
    const secure = process.env.SMTP_SECURE || process.env.SMPT_SECURE;
    const user = process.env.SMTP_USER || process.env.SMPT_USER;
    const pass = process.env.SMTP_PASS || process.env.SMPT_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(port || "587"),
        secure: secure === "true",
        auth: {
          user,
          pass
        }
      });
      console.log("✉️  Custom SMTP mail transporter configured");
      this.transporter.verify((error) => {
        if (error) {
          console.error("❌ SMTP connection verification failed:", error.message);
        } else {
          console.log("✉️  SMTP connection established successfully");
        }
      });
    } else {
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        console.log(`✉️  Ethereal SMTP test account initialized: ${testAccount.user}`);
      } catch (err) {
        console.error("❌ Failed to initialize Ethereal SMTP test account:", err.message);
      }
    }
  }

  async sendEmail({ to, subject, html, text }) {
    if (process.env.BREVO_API_KEY) {
      try {
        const fromName = process.env.SMTP_FROM_NAME || process.env.SMPT_FROM_NAME || "Buy-Wise Support";
        const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMPT_FROM_EMAIL || process.env.MAIL_ADDRESS || process.env.MAIL_ADDRES || process.env.SMTP_USER || process.env.SMPT_USER || "support@buywise.com";

        const response = await axios.post("https://api.brevo.com/v3/smtp/email", {
          sender: { name: fromName, email: fromEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text
        }, {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });

        console.log(`✉️  Email successfully sent to ${to} via Brevo HTTP API (MessageID: ${response.data.messageId || "unknown"})`);
        return response.data;
      } catch (err) {
        const apiError = err.response && err.response.data ? JSON.stringify(err.response.data) : err.message;
        console.error("❌ Failed to send email via Brevo HTTP API:", apiError);
        throw err;
      }
    }

    if (this.initPromise) {
      await this.initPromise;
    }
    if (!this.transporter) {
      console.warn("⚠️  No mail transporter initialized. Logging mail to console:");
      console.log(`To: ${to}\nSubject: ${subject}\nBody: ${text || html}`);
      return;
    }

    try {
      const fromName = process.env.SMTP_FROM_NAME || process.env.SMPT_FROM_NAME || "Buy-Wise Support";
      const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMPT_FROM_EMAIL || process.env.MAIL_ADDRESS || process.env.MAIL_ADDRES || process.env.SMTP_USER || process.env.SMPT_USER || "support@buywise.com";
      const info = await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        text,
        html
      });

      const testUrl = nodemailer.getTestMessageUrl(info);
      if (testUrl) {
        console.log(`\n📬  [TEST EMAIL SENT] View verification/reset mail: ${testUrl}\n`);
      } else {
        console.log(`✉️  Email successfully sent to ${to}`);
      }
      return info;
    } catch (err) {
      console.error("❌ Failed to send email:", err.message);
      throw err;
    }
  }

  async sendVerificationEmail(email, name, token) {
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const verificationLink = `${backendUrl}/api/auth/verify/${token}`;

    const subject = "Activate your Buy-Wise account";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ded9cf; border-radius: 12px; background: #fff;">
        <h2 style="color: #12312b;">Welcome to Buy-Wise!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account with Buy-Wise. Please click the button below to confirm your email address and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: #0e8f77; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Activate Account</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #556170;">${verificationLink}</p>
        <hr style="border: 0; border-top: 1px solid #ece7de; margin: 20px 0;" />
        <p style="font-size: 12px; color: #8a96a6;">If you did not request this email, you can safely ignore it.</p>
      </div>
    `;
    const text = `Hi ${name},\n\nPlease activate your Buy-Wise account by clicking this link:\n${verificationLink}\n\nThank you!\nBuy-Wise Team`;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendResetPasswordEmail(email, token) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/account?resetToken=${token}`;

    const subject = "Reset your Buy-Wise password";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ded9cf; border-radius: 12px; background: #fff;">
        <h2 style="color: #12312b;">Reset Password Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your Buy-Wise account. Please click the button below to set a new password. This link is valid for 1 hour:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #0e8f77; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #556170;">${resetLink}</p>
        <hr style="border: 0; border-top: 1px solid #ece7de; margin: 20px 0;" />
        <p style="font-size: 12px; color: #8a96a6;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `;
    const text = `Hello,\n\nPlease reset your Buy-Wise password by clicking this link:\n${resetLink}\n\nThis link is valid for 1 hour.\n\nBuy-Wise Team`;

    return this.sendEmail({ to: email, subject, html, text });
  }
}

module.exports = new EmailService();
