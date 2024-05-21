"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import { useAuthContext } from "@app/hooks/useAuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Messages = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for the presence of a cookie indicating successful login
    const isLoggedIn = Cookies.get('isLoggedIn');

    if (!user && !isLoggedIn) {
      router.push('/sign-in');
    } else if (user) {
      fetchMessages();
    }
  }, [user, router]);

  const username = user?.username;

  // Fetch messages from the backend
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/messages/${username}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error("Failed to fetch messages: ", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching messages: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/messages/delete/${messageId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessages(messages.filter((message) => message._id !== messageId)); // Update the messages state
      } else {
        console.error("Failed to delete message: ", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete message: ", error);
    }
  };

  // Custom time formatter to remove "about"
  const formatTime = (date) => {
    // Ensure date is valid
    if (!date || isNaN(new Date(date).getTime())) {
      return "Invalid date";
    }

    let distance = formatDistanceToNow(new Date(date), { addSuffix: true });
    distance = distance.replace(/^about /, '');
    return distance;
  };

  // Render loading spinner while loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-5xl animate-spin text-gray-500">
          <FontAwesomeIcon icon={faSpinner} />
        </h2>
      </div>
    );
  }

  // Render messages or a placeholder if there are no messages
  return (
    <section className="pt-24 px-3 flex flex-col sm:flex-row gap-4 flex-wrap">
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((message, index) => (
          <div className="w-fit border-2 rounded-md font-poppins bg-slate-800 opacity-90 border-slate-600 flex flex-col gap-2" key={index}>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center gap-3">
                <h1 className="white_gradient text-lg font-semibold pb-1">Anonymous Message</h1>
                <FontAwesomeIcon icon={faTrash} className="text-sm hover:cursor-pointer text-slate-300" onClick={() => deleteMessage(message._id)} />
              </div>
              <h1>{message.message}</h1>
            </div>
            <h1 className="bg-gradient-to-r from-gray-400 to-slate-600 rounded-b-sm w-full pt-1 px-1"> {formatTime(message.createdAt)}</h1>
          </div>
        ))
      ) : (
        <div className="pt-24 px-3 flex flex-col items-center gap-3">
          <h1 className="text-xl font-inter white_gradient">
            You do not have any secret messages yet
          </h1>
          <p>
            Click <Link href="/generate-messages" className="underline text-blue-400 hover:text-blue-500">here</Link> to start getting secret messages
          </p>
        </div>
      )}
    </section>
  );
};

export default Messages;
