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
          <Section style={s.card}>
            <Img
              src="https://res.cloudinary.com/dlnvweuhv/image/upload/w_300,q_auto/v1750542515/maluda-anonymous_xq8djd.jpg"
              alt="Maluda Anonymous Logo"
              width="150"
              style={s.logo}
            />
            <Heading style={s.heading}>Verify your email, {username}</Heading>
            <Text style={s.text}>
              Confirm that <strong>{email}</strong> belongs to you to finish
              setting up your Maluda Anonymous account.
            </Text>
            <a href={verifyUrl} style={s.button}>
              Verify Email
            </a>
            <Text style={s.mutedText}>
              This link expires in 24 hours. If you didn't create this
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
