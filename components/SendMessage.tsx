"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, UserPlus, MessageCircleHeart } from "lucide-react";
import Link from "next/link";

interface SendMessageProps {
  username: string;
  callbackUrl: string;
}

export default function SendMessage({
  username,
  callbackUrl,
}: SendMessageProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    if (message.length > 500) {
      toast.error("Message cannot exceed 500 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/messages/${username.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      toast.success("Message sent successfully!");
      setMessage("");
      setIsSuccess(true); // Show CTA card
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsSuccess(false); // Show form again
    setMessage("");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      {isSuccess ? (
        <Card className="bg-card border border-border rounded-lg shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground font-poppins">
              Message Sent!
            </CardTitle>
            <p className="text-muted-foreground">
              Your anonymous message was sent to {username}. Want to receive
              secret messages too?
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 hover:cursor-pointer"
            >
              <Link href="/sign-up">
                <UserPlus className="w-4 h-4" />
                Create Your Account
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full text-foreground border-border hover:bg-background/10 hover:cursor-pointer"
              onClick={handleSendAnother}
            >
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border border-border rounded-lg shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageCircleHeart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground font-poppins">
              Send {username} an anonymous message
            </CardTitle>
            <p className="text-muted-foreground">
              They won&apos;t see your name — keep it honest and respectful.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="bg-background text-foreground border-input focus:ring-ring resize-none h-32"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 hover:cursor-pointer"
                disabled={isSubmitting}
                >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
