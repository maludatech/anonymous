"use client"

import { useEffect, useState } from "react";
import { useAuthContext } from "@app/hooks/useAuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const GenerateMessage = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  
  useEffect(() => {
    // Check for the presence of a cookie indicating successful login
    const isLoggedIn = Cookies.get('isLoggedIn');

    
    if (!user && !isLoggedIn) {
      router.push('/sign-in');
    }
  }, [user, router]);

  const [text, setText] = useState("");
  const [copyText, setCopyText] = useState("copy");

  useEffect(() => {
    if (user) {
      setText(`http://localhost:3000/send-message/${user.username}`);
    }
  }, [user]);


  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopyText("copied");
    setTimeout(() => {
      setCopyText("copy");
    }, 2000);
  };

  return (
    <section className="flex flex-col pt-36 justify-center px-3 sm:ml-[20%] sm:mr-[16%]">
      <div className="p-10 bg-slate-900 opacity-60 rounded-xl flex flex-col gap-2">
        <h1 className='font-poppins font-bold text-white text-2xl'>
          Maluda's Anonymous 🤞🏾
        </h1>
        <p className="text-[15px] sm:text-lg">
          Let your friends write you a secret message. All you have to do is to share your personal link with them and they will drop a message for you! You might even get lucky to discover a long time crush on you💕
        </p>
        <div className="flex  gap-3 w-full pt-2">
          <input className="bg-white opacity-95 p-2 rounded-lg border-2 border-gray-300 text-black w-full" value={text} readOnly/>
          <button className="bg-blue-500 text-white rounded-lg p-2 sm:text-lg w-fit hover:bg-blue-600" onClick={handleCopy}>{copyText}</button>
        </div>
      </div>
    </section>
  );
};

export default GenerateMessage;
