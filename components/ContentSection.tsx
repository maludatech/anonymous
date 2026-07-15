import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, MessageCircleHeart, ShieldCheck } from "lucide-react";

export default function ContentSection() {
  const features = [
    {
      icon: <Link2 className="h-8 w-8 text-primary" />,
      title: "One link, share anywhere",
      description:
        "Sign up and get a personal link you can drop in your bio, story, or group chat.",
    },
    {
      icon: <MessageCircleHeart className="h-8 w-8 text-primary" />,
      title: "Real, anonymous messages",
      description:
        "Anyone with your link can send you a message — no account or login required on their end.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Only you can read them",
      description:
        "Messages land in your private dashboard. No one else can see who sent what, or that it exists.",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 pt-4 pb-24">
      <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
        How it works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-border bg-card text-card-foreground transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
