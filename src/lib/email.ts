import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `"AI App Generator" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h2 style="color:#3b82f6; margin-bottom: 8px;">AI App Generator</h2>
        <p style="color: #94a3b8; font-size: 14px;">Your one-time verification code is:</p>
        <div style="letter-spacing: 12px; font-size: 40px; font-weight: bold; text-align:center; padding: 24px 0; color: #f1f5f9;">
          ${code}
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code expires in <strong style="color:#f1f5f9;">10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  });
}
