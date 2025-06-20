import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Shield } from "lucide-react";

export default function ContentSection() {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Efficient Scheduling",
      description:
        "Plan and manage your time effectively with our intuitive tools.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Anonymous Feedback",
      description: "Gather honest feedback without compromising privacy.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Platform",
      description: "Your data is protected with top-tier security measures.",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 pt-16 pb-48">
      <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
        Our Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow bg-card text-card-foreground"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {feature.icon}
                <span>{feature.title}</span>
              </CardTitle>
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
