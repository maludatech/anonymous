import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_NAME = process.env.SENDER_NAME || "Maluda Anonymous";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "no-reply@driftfund.net";
const FROM = `${SENDER_NAME} <${SENDER_EMAIL}>`;

export async function sendResetEmail(email: string, resetUrl: string) {
  try {
    const { render } = await import("@react-email/render");
    const { default: PasswordResetEmail } = await import(
      "@/emails/PasswordResetEmail"
    );

    const emailHtml = await render(
      React.createElement(PasswordResetEmail, { email, resetUrl }),
    );

    const response = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Maluda Anonymous - Password Reset",
      html: emailHtml,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      throw new Error(response.error.message);
    }

    return response;
  } catch (error: any) {
    console.error("Reset email error:", {
      message: error.message,
      status: error.status,
      response: error.response?.data,
    });
    throw new Error("Failed to send reset email");
  }
}

export async function sendWelcomeEmail(email: string, username: string) {
  try {
    const { render } = await import("@react-email/render");
    const { default: WelcomeEmail } = await import("@/emails/WelcomeEmail");

    const emailHtml = await render(
      React.createElement(WelcomeEmail, { email, username }),
    );

    const response = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to Maluda Anonymous!",
      html: emailHtml,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      throw new Error(response.error.message);
    }

    return response;
  } catch (error: any) {
    console.error("Welcome email error:", {
      message: error.message,
      status: error.status,
      response: error.response?.data,
    });
    throw new Error("Failed to send welcome email");
  }
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyUrl: string,
) {
  try {
    const { render } = await import("@react-email/render");
    const { default: VerifyEmail } = await import("@/emails/VerifyEmail");

    const emailHtml = await render(
      React.createElement(VerifyEmail, { email, username, verifyUrl }),
    );

    const response = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Verify your Maluda Anonymous email",
      html: emailHtml,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      throw new Error(response.error.message);
    }

    return response;
  } catch (error: any) {
    console.error("Verification email error:", {
      message: error.message,
      status: error.status,
      response: error.response?.data,
    });
    throw new Error("Failed to send verification email");
  }
}
