// app/components/Dashboard.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Copy, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";

interface Message {
  _id: string;
  message: string;
  createdAt: string;
}

const Dashboard = ({ callbackUrl }: { callbackUrl: string }) => {
  const { user, isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [link, setLink] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [loading, setLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user || !token) {
      toast.error("Please sign in to access your dashboard.");
      router.push(callbackUrl);
    } else {
      setLink(
        `${process.env.NEXT_PUBLIC_APP_URL || "https://maluda-anonymous.vercel.app"}/send-message/${user.username}`
      );
      fetchMessages();
    }
  }, [user, isAuthenticated, token, router, callbackUrl]);

  // Fetch messages
  const fetchMessages = async () => {
    if (!user?.username) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/messages/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to fetch messages.");
      }
    } catch (error) {
      toast.error("Error fetching messages.");
      console.error("Fetch messages error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (deletingIds.has(messageId)) return;
      setDeletingIds((prev) => new Set(prev).add(messageId));

      const previousMessages = messages;
      setMessages(messages.filter((msg) => msg._id !== messageId));
      setOpenDialogId(null);

      try {
        if (!token) {
          toast.error("Session expired. Please sign in again.");
          router.push("/sign-in");
          setMessages(previousMessages);
          return;
        }

        const response = await fetch(`/api/messages/delete/${messageId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete message");
        }

        toast.success("Message deleted successfully.");
      } catch (error: any) {
        console.error("Delete message error:", {
          messageId,
          message: error.message,
          stack: error.stack,
        });
        toast.error(error.message || "Failed to delete message.");
        setMessages(previousMessages);
      } finally {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }
    },
    [messages, token, router, deletingIds]
  );

  // Copy link
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopyText("Copied!");
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopyText("Copy"), 2000);
    } catch (error) {
      toast.error("Failed to copy link.");
      console.error("Copy error:", error);
    }
  };

  // Share to X
  const handleShare = (message: string) => {
    const shareText = `Received an anonymous message: "${truncateMessage(
      message,
      100
    )}" via Maluda Anonymous!`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(link)}`;
    window.open(shareUrl, "_blank");
  };

  // Format timestamp
  const formatTime = (date: string) => {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "Invalid date";
      return formatDistanceToNow(parsedDate, { addSuffix: true }).replace(
        /^about /,
        ""
      );
    } catch {
      return "Invalid date";
    }
  };

  // Truncate message
  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.slice(0, maxLength) + "...";
  };

  return (
    <section className="flex flex-col min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <Card className="mb-6 bg-card border border-border rounded-lg shadow-lg animate-in slide-in-from-top">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground font-poppins">
              Welcome, {user?.username || "User"}! 🤞
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Share your unique link to receive anonymous messages from friends.
              Who knows, maybe a secret crush will reveal themselves! 💕
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={link}
                readOnly
                className="bg-input text-foreground border-border rounded-md p-2 flex-1"
              />
              <Button
                onClick={handleCopy}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md p-2 flex items-center gap-2 hover:cursor-pointer"
              >
                <Copy className="w-4 h-4" /> {copyText}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              <div className="col-span-full flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-foreground">
                  Your Inbox 📬
                </h2>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {messages.length}
                </span>
              </div>
              {messages.map((message) => (
                <Dialog
                  key={message._id}
                  open={openDialogId === message._id}
                  onOpenChange={(open) =>
                    setOpenDialogId(open ? message._id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Card
                      className="bg-card border-border rounded-lg shadow-md animate-in zoom-in duration-300 hover:cursor-pointer hover:bg-background/5 hover:shadow-lg transition-all"
                      aria-label="View full message"
                    >
                      <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <h3 className="text-lg font-semibold text-primary">
                              Anonymous Message
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(message._id);
                            }}
                            className="text-muted-foreground hover:text-destructive hover:cursor-pointer"
                            disabled={deletingIds.has(message._id)}
                            aria-label="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-foreground line-clamp-2">
                          {truncateMessage(message.message)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(message.createdAt)}
                        </p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" />
                  <DialogContent className="bg-card border-border rounded-lg shadow-lg animate-in zoom-in duration-300 max-w-md p-4">
                    <DialogHeader>
                      <DialogTitle className="text-primary">
                        Anonymous Message
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                      <p className="text-foreground">{message.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(message.createdAt)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(message.message)}
                        className="mt-2 text-foreground border-border hover:bg-background/10"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share to X
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border rounded-lg shadow-md text-center p-6 animate-in zoom-in">
              <CardContent>
                <p className="text-xl font-semibold text-foreground">
                  No secret messages yet! 📬
                </p>
                <p className="text-muted-foreground">
                  Share your link to hear from your secret admirers! 💌
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
