import { Resend } from "resend";
import { render } from "@react-email/render";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import WelcomeEmail from "@/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, resetUrl: string) {
  try {
    const emailHtml = await render(
      <PasswordResetEmail email={email} resetUrl={resetUrl} />,
      { pretty: true }
    );

    await resend.emails.send({
      from: "Maluda Anonymous <no-reply@your-domain.com>",
      to: email,
      subject: "Maluda Anonymous - Password Reset",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Reset email error:", error);
    throw new Error("Failed to send reset email");
  }
}

export async function sendWelcomeEmail(email: string, username: string) {
  try {
    const emailHtml = await render(
      <WelcomeEmail email={email} username={username} />,
      { pretty: true }
    );

    await resend.emails.send({
      from: "Maluda Anonymous <no-reply@your-domain.com>",
      to: email,
      subject: "Welcome to Maluda Anonymous!",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Welcome email error:", error);
    throw new Error("Failed to send welcome email");
  }
}
