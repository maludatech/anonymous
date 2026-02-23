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

interface PasswordResetEmailProps {
  email: string;
  resetUrl: string;
}

export default function PasswordResetEmail({
  email,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        Reset your Maluda Anonymous password — link expires in 1 hour
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.card}>
            <Img
              src="https://res.cloudinary.com/dlnvweuhv/image/upload/w_300,q_auto/v1750542515/maluda-anonymous_xq8djd.jpg"
              alt="Maluda Anonymous Logo"
              width="150"
              style={s.logo}
            />
            <Heading style={s.heading}>Reset Your Password</Heading>
            <Text style={s.text}>
              You requested a password reset for your Maluda Anonymous account
              associated with <strong>{email}</strong>.
            </Text>
            <a href={resetUrl} style={s.button}>
              Reset Password
            </a>
            <Text style={s.mutedText}>
              This link expires in 1 hour. If you didn't request this, you can
              safely ignore this email.
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #e4e4e7",
    padding: "40px 40px 32px",
    textAlign: "center",
  },
  logo: {
    display: "block",
    margin: "0 auto 24px",
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
    backgroundColor: "#1d4ed8",
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
