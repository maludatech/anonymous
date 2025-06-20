import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, resetUrl: string) {
  try {
    await resend.emails.send({
      from: "no-reply@your-domain.com",
      to: email,
      subject: "Maluda Anonymous - Password Reset",
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="color: #1D4ED8;">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn’t request this, ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send reset email");
  }
}
