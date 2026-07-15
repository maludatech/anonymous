import fs from "fs";
import path from "path";

function toDataUri(relativePath: string, mimeType: string): string {
  const filePath = path.join(process.cwd(), relativePath);
  const bytes = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

export const EMAIL_HEADER_DATA_URI = toDataUri(
  "public/assets/images/email-header.png",
  "image/png"
);
