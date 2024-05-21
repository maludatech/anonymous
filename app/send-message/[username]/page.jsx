"use client"

import Link from "next/link";
import { useState } from "react";

const sendMessage = ({params}) => {

  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sendText, setSendText] = useState("Send Message");
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = async(e) =>{
    e.preventDefault();
    if (message.length > 1000) {
      setSendText("Message too long");
      setTimeout(() => setSendText("Send Message"), 3000); 
      return;
    }
    setIsLoading(true);
    try{
      const response = await fetch(`/api/messages/${username}`, {
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({message: message})
      })
      if(response.ok){
        setSendText("Sent!!!")
        setTimeout(()=>setSendText("Send Message"), 3000);
        setMessageSent(true);
      }
    }catch(e){
      setSendText("Failed to send");
      setTimeout(()=>setSendText("Send Message"), 3000);
    }finally{
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <section className="flex flex-col pt-36 justify-center px-3 sm:ml-[20%] sm:mr-[16%]">
      <div className="p-10 bg-slate-900 opacity-60 rounded-xl flex flex-col gap-2">
        <h1 className='font-poppins font-bold text-white text-xl pb-2'>
            Drop a Secret Message for {params.username}
        </h1>
        <form className="flex flex-col gap-3 w-full pt-2" onSubmit={handleSendMessage}>
          <label className="font-semibold">Message:</label>
          <textarea className="bg-slate-700 p-2 rounded-lg border-2 border-gray-500 text-white w-full" value={message} onChange={(e)=>setMessage(e.target.value)} required/>
          <button className="bg-blue-500 text-white rounded-lg p-2 sm:text-lg w-fit hover:bg-blue-600 hover:border-2 hover:border-blue-400" disabled={isLoading}>{isLoading ? "Sending..." : sendText}</button>
        </form>
        {messageSent && <p className="font-poppins pt-2">Create your own <Link href={"/sign-up"} className="text-semibold text-blue-500 hover:underline">account</Link> to receive your own anonymous messages</p>}
      </div>
    </section>
  )
}

export default sendMessage;