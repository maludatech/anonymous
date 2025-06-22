import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Heading,
  Button,
  Section,
  Tailwind,
  Img,
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
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "oklch(0.55 0.19 265.5)", // blue-700
                muted: "#6b7280",
                background: "#ffffff",
                foreground: "#111827",
              },
            },
          },
        }}
      >
        <Body className="bg-background text-foreground font-sans">
          <Container className="mx-auto p-6 max-w-xl">
            <Section className="bg-card rounded-lg shadow-lg border border-gray-200 p-8 text-center">
              <Img
                src="https://res.cloudinary.com/dlnvweuhv/image/upload/w_300,q_auto/v1750542515/maluda-anonymous_xq8djd.jpg"
                alt="Maluda Anonymous Logo"
                width="150"
                height="auto"
                className="mx-auto mb-6"
              />
              <Heading className="text-2xl font-bold text-foreground mb-4">
                Reset Your Password
              </Heading>
              <Text className="text-muted mb-4">
                You requested a password reset for your Maluda Anonymous
                account: ({email}).
              </Text>
              <Button
                href={resetUrl}
                className="bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/90 inline-block mb-4"
              >
                Reset Password
              </Button>
              <Text className="text-muted mb-4">
                This link expires in 1 hour. If you didn’t request this, please
                ignore this email.
              </Text>
              <Text className="text-muted text-sm">
                © {new Date().getFullYear()} Maluda Anonymous. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
