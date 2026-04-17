import { useEffect, useState } from "react";
import LogoIcon from "./LogoIcon";
import SendIcon from "./SendIcon";
import { socket } from "../socket";

function AiChatBox() {
  const [querry, updatequerry] = useState("")
  type Sender = "user" | "bot";
  type Message = {
    sender: Sender;
    text: string;
  }
  const [messages, setMessage] = useState<Message[]>([{ sender: "user", text: "how are you" }, { sender: "bot", text: "I am fine" }, { sender: "user", text: "how are you" }, { sender: "user", text: "how are you" }])
  // whenever AiChatBox render on UI this socket connect useeffect  will run and try to connect a wab-socket to the server
  useEffect(() => {
    socket.connect()

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });


    return () => {
      socket.disconnect();
    }
  }, [])

  const sendQuerry = () => {
    console.log("button clicked", messages);

    const message: Message = { sender: "user", text: querry }
    setMessage((prev) => [...prev, message])
    socket.emit("querry_sent", { querry: message.text })
    socket.on("answer_received", (ai_response) => {
      setMessage((prev) => [...prev, { sender: "bot", text: ai_response }])
    })

  }
  return (
    <div className="bg-[#0d0f14] min-h-screen border border-[#1E2530]">
      {/* contrib.ai assistant */}
      <div className="flex border border-[#1E2530] gap-3.5 pl-4 ">
        <LogoIcon />
        <div className="   text-white">
          <div className="font-syne-Bold text-[13px]">contrib.ai assistant</div>
          <div className="text-[12px] text-[#6b7788]">context-aware · facebook/react</div>
        </div>
      </div>
      {/* where do i start */}
      <div className=" border border-[#1E2530] text-white flex gap-3 p-2 text-[11px] ">
        <div className="rounded-[5px] bg-[#11141C] border-2 border-[#1E2530] text-[#828FAC] px-2">Where do I start?</div>
        <div className="rounded-[5px] bg-[#11141C] border-2 border-[#1E2530] text-[#828FAC] px-2">Explain the architecture</div>
        <div className="rounded-[5px] bg-[#11141C] border-2 border-[#1E2530] text-[#828FAC] px-2">Find a good first issue</div>
        <div className="rounded-[5px] bg-[#11141C] border-2 border-[#1E2530] text-[#828FAC] px-2">How do I run this locally?</div>
      </div>
      {/* chat app */}
      <div className=" flex flex-col gap-2 p-3.5 overflow-y-auto py-auto min-h-[83vh] ">
        {messages.map((msg: Message, i: number) => (
          <div key={i} className={`max-w-xs px-4 py-2 rounded-lg text-[14px] text-white ${msg.sender === "user" ? "bg-[#11141c] text-black ml-auto border border-[#1e2530]" : "bg-[#1a2035] border-2 border-[#2a3048]  "
            }`}>
            {msg.text}
          </div>
        ))}

      </div>
      {/* input box */}
      <div className="flex border-2 border-[#1E2530]  items-center justify-around px-4 pr-4 h-[10vh]">
        <input type="text" value={querry} onChange={(e) => { updatequerry(e.target.value) }} placeholder="Ask anything about this repo…" className="rounded-2xl pl-3 text-white border-2 border-[#1E2530] min-w-[95%] h-[65%]" />
        {/* <div className="rounded-2xl text-white border-2 border-[#1E2530] min-w-[95%] h-[65%]">Ask anything about this repo…</div> */}
        {/* send button */}


        <button onClick={sendQuerry} className="border border-white cursor-pointer">
          <SendIcon />
        </button>

      </div>
    </div>
  )
}

export default AiChatBox