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

interface WelcomeEmailProps {
  email: string;
  username: string;
}

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://maludaanonymous.com";

export default function WelcomeEmail({ email, username }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        Welcome to Maluda Anonymous, {username} — your account is ready
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
            <Heading style={s.heading}>
              Welcome to Maluda Anonymous, {username}!
            </Heading>
            <Text style={s.text}>
              We&apos;re thrilled to have you join our community. Your account{" "}
              <strong>{email}</strong> is ready to start sending and receiving
              anonymous messages.
            </Text>
            <a href={`${APP_URL}/dashboard`} style={s.button}>
              Go to Dashboard
            </a>
            <Text style={s.mutedText}>
              Explore our platform to share feedback anonymously and connect
              with others securely.
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
