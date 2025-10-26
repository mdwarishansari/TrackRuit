import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (emailOptions) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"TrackRuit" <${process.env.SMTP_USER}>`,
      ...emailOptions,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${emailOptions.to}`);
    return result;
  } catch (error) {
    logger.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};

export const sendOTPEmail = async (email, otp, name = "User") => {
  const subject = "Your TrackRuit Verification OTP";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">TrackRuit Account Verification</h2>
      <p>Hello ${name},</p>
      <p>Your verification code is:</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The TrackRuit Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

export const sendPasswordResetEmail = async (
  email,
  resetToken,
  name = "User"
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = "TrackRuit Password Reset Request";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The TrackRuit Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};
