import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Img,
  Preview,
} from "@react-email/components";
import { EMAIL_HEADER_DATA_URI } from "@/lib/email-assets";

interface VerifyEmailProps {
  email: string;
  username: string;
  verifyUrl: string;
}

export default function VerifyEmail({
  email,
  username,
  verifyUrl,
}: VerifyEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        Verify your Maluda Anonymous email — link expires in 24 hours
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Img
            src={EMAIL_HEADER_DATA_URI}
            alt="Maluda Anonymous — Say it. Stay anonymous."
            width="520"
            height="208"
            style={s.banner}
          />
          <Section style={s.card}>
            <Heading style={s.heading}>Verify your email, {username}</Heading>
            <Text style={s.text}>
              Confirm that <strong>{email}</strong> belongs to you to finish
              setting up your Maluda Anonymous account.
            </Text>
            <a href={verifyUrl} style={s.button}>
              Verify Email
            </a>
            <Text style={s.mutedText}>
              This link expires in 24 hours. If you didn&apos;t create this
              account, you can safely ignore this email.
            </Text>
            <Text style={s.footer}>
              © {new Date().getFullYear()} Maluda Anonymous. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const s: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    margin: 0,
    padding: 0,
  },
  container: {
    maxWidth: "520px",
    margin: "40px auto",
    padding: "0 16px",
  },
  banner: {
    display: "block",
    width: "100%",
    maxWidth: "520px",
    height: "auto",
    borderRadius: "10px",
    marginBottom: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #e4e4e7",
    padding: "40px 40px 32px",
    textAlign: "center",
  },
  heading: {
    color: "#111827",
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    margin: "0 0 16px",
  },
  text: {
    color: "#52525b",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 24px",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#6d28d9",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 600,
    textDecoration: "none",
    padding: "13px 28px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  mutedText: {
    color: "#71717a",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "0 0 24px",
  },
  footer: {
    color: "#a1a1aa",
    fontSize: "12px",
    margin: 0,
  },
};
