export const APP_NAME = process.env.APP_NAME || "Maluda Anonymous";
export const APP_SLOGAN =
  process.env.APP_SLOGAN || "Say it. Stay anonymous.";
export const APP_DESCRIPTION =
  process.env.APP_DESCRIPTION ||
  "Get a shareable link, receive honest anonymous messages from friends and followers, and read them from your own private dashboard.";
export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://maluda-anonymous.vercel.app"
).replace(/\/+$/, "");
