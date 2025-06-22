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

interface WelcomeEmailProps {
  email: string;
  username: string;
}

export default function WelcomeEmail({ email, username }: WelcomeEmailProps) {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "oklch(0.55 0.19 265.5)",
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
                Welcome to Maluda Anonymous, {username}!
              </Heading>
              <Text className="text-muted mb-4">
                We’re thrilled to have you join our community. Your account (
                {email}) is ready to start sending and receiving anonymous
                messages.
              </Text>
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                className="bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/90 inline-block mb-4"
              >
                Go to Dashboard
              </Button>
              <Text className="text-muted mb-4">
                Explore our platform to share feedback anonymously and connect
                with others securely.
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
