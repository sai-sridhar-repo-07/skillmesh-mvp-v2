import nodemailer from "nodemailer";
import { Resend } from "resend";

const sender = process.env.EMAIL_FROM || "noreply@example.com";

export async function sendEmail(to: string, subject: string, html: string) {
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: sender, to, subject, html });
    return;
  }
  // fallback SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
  await transporter.sendMail({ from: sender, to, subject, html });
}

export const templates = {
  sessionReminder: (name: string, topic: string, when: string) => `
    <div style="font-family:Inter,Arial,sans-serif">
      <h2>⏰ Session starting soon</h2>
      <p>Hi ${name}, your session <b>${topic}</b> starts at <b>${when}</b>.</p>
      <p>See you on SkillMesh!</p>
    </div>`
};
