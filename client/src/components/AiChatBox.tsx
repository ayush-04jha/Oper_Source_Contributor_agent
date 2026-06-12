import { useCallback, useEffect, useState } from "react";
import LogoIcon from "./LogoIcon";
import SendIcon from "./SendIcon";
import { socket } from "../socket";
import API from "../../axiosSetup/API";
import { useParams } from "react-router-dom";
import type { AxiosError } from "axios";

function AiChatBox() {

  const { jobId } = useParams();
  const repoId = jobId ?? localStorage.getItem("repoId");
  const conversationStorageKey = repoId ? `conversationId:${repoId}` : "conversationId";
  const [querry, updatequerry] = useState("")
  type Sender = "user" | "bot";
  type Message = {
    sender: Sender;
    text: string;
  }
  const [messages, setMessage] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null);
  // whenever AiChatBox render on UI this socket connect useeffect  will run and try to connect a wab-socket to the server
  // functions
  const createConversation = useCallback(async () => {
    const res = await API.post("/conversation");
    const newConversationId = res.data._id;

    setConversationId(newConversationId);

    localStorage.setItem(
      conversationStorageKey,
      newConversationId
    );

    return newConversationId;
  }, [conversationStorageKey])

  const fetchMessage = useCallback(async () => {
    console.log("frontend convId:",conversationId);
    try {
      const response = await API.get("/messages", {
        params: {
          conversationId,
        },
      });
      setMessage(response.data);
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 404) {
        localStorage.removeItem(conversationStorageKey);
        setMessage([]);
        await createConversation();
        return;
      }

      console.error(err);
    }
  }, [conversationId, conversationStorageKey, createConversation])

  const sendQuerry = () => {

    console.log("button clicked", messages); // working

    const message: Message = { sender: "user", text: querry }
    if (!message.text.trim()) return
    setMessage((prev) => [...prev, message]);
    socket.emit("querry_sent", { conversationId, repoId, querry: message.text })
    updatequerry("")
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevents newline
      sendQuerry(); // your send function
    }
  };
  //useEffects 1
  useEffect(() => {
    if (jobId) {
      localStorage.setItem("repoId", jobId);
    }
  }, [jobId])
  //useEffects 1
  useEffect(() => {
    const initConversation = async () => {

      const existingId =
        localStorage.getItem(conversationStorageKey);

      if (existingId) {
        setConversationId(existingId);
        return;
      }

      await createConversation();
    };

    initConversation();
  }, [conversationStorageKey, createConversation]);
  //useEffects 2
  useEffect(() => {
    if (!conversationId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessage();
  }, [conversationId, fetchMessage])

  //useEffects 3
  useEffect(() => {
    socket.connect()
    if (socket.connected) {
      console.log("Already connected:", socket.id);
    }
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    }
  }, [])
  //useEffects 4
  useEffect(() => {
    const handler = (data: { ai_response: string }) => {
      setMessage((prev) => [
        ...prev,
        { sender: "bot", text: data.ai_response }
      ]);
    }

    socket.on("answer_received", handler);

    return () => {
      socket.off("answer_received", handler);
    };
  }, []);

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
        <input type="text" onKeyDown={handleKeyDown} value={querry} onChange={(e) => { updatequerry(e.target.value) }} placeholder="Ask anything about this repo…" className="rounded-2xl pl-3 text-white border-2 border-[#1E2530] min-w-[95%] h-[65%]" />
        {/* <div className="rounded-2xl text-white border-2 border-[#1E2530] min-w-[95%] h-[65%]">Ask anything about this repo…</div> */}
        {/* send button */}


        <button onClick={sendQuerry} className="cursor-pointer">
          <SendIcon />
        </button>

      </div>
    </div>
  )
}

export default AiChatBox
