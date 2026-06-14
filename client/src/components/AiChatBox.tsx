import { useCallback, useEffect, useState } from "react";
import LogoIcon from "./LogoIcon";
import SendIcon from "./SendIcon";
import { socket } from "../socket";
import API from "../../axiosSetup/API";
import { useParams } from "react-router-dom";
import type { AxiosError } from "axios";

type RepoIssue = {
  id: number;
  title: string;
  number: number;
  labels: string[];
  status: "open" | "triaged";
  updatedAt: string;
};

const repoIssues: RepoIssue[] = [
  {
    id: 1,
    title: "Improve onboarding flow for first-time contributors",
    number: 428,
    labels: ["good first issue", "docs"],
    status: "open",
    updatedAt: "2h ago",
  },
  {
    id: 2,
    title: "Fix message overflow in long AI responses",
    number: 417,
    labels: ["bug", "frontend"],
    status: "triaged",
    updatedAt: "1d ago",
  },
  {
    id: 3,
    title: "Add empty state for repositories with no chats",
    number: 404,
    labels: ["enhancement", "frontend"],
    status: "open",
    updatedAt: "3d ago",
  },
  {
    id: 4,
    title: "Document local setup for Windows environments",
    number: 391,
    labels: ["docs", "help wanted"],
    status: "open",
    updatedAt: "5d ago",
  },
];

const issueLabels = Array.from(
  new Set(repoIssues.flatMap((issue) => issue.labels))
);

function AiChatBox() {
  const { jobId } = useParams();
  const repoId = jobId ?? localStorage.getItem("repoId");
  const conversationStorageKey = repoId ? `conversationId:${repoId}` : "conversationId";
  const [querry, updatequerry] = useState("");
  const [activeLabel, setActiveLabel] = useState("All");
  type Sender = "user" | "bot";
  type Message = {
    sender: Sender;
    text: string;
  };
  const [messages, setMessage] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const filteredIssues =
    activeLabel === "All"
      ? repoIssues
      : repoIssues.filter((issue) => issue.labels.includes(activeLabel));

  // whenever AiChatBox render on UI this socket connect useeffect will run and try to connect a web-socket to the server
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
  }, [conversationStorageKey]);

  const fetchMessage = useCallback(async () => {
    console.log("frontend convId:", conversationId);
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
  }, [conversationId, conversationStorageKey, createConversation]);

  const sendQuerry = () => {
    console.log("button clicked", messages); // working

    const message: Message = { sender: "user", text: querry };
    if (!message.text.trim()) return;
    setMessage((prev) => [...prev, message]);
    socket.emit("querry_sent", { conversationId, repoId, querry: message.text });
    updatequerry("");
  };

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
  }, [jobId]);

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
  }, [conversationId, fetchMessage]);

  //useEffects 3
  useEffect(() => {
    socket.connect();
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
    };
  }, []);

  //useEffects 4
  useEffect(() => {
    const handler = (data: { ai_response: string }) => {
      setMessage((prev) => [
        ...prev,
        { sender: "bot", text: data.ai_response }
      ]);
    };

    socket.on("answer_received", handler);

    return () => {
      socket.off("answer_received", handler);
    };
  }, []);

  return (
    <div className="min-h-screen border border-[#1E2530] bg-[#0d0f14]">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-h-screen flex-col border-r border-[#1E2530]">
          {/* contrib.ai assistant */}
          <div className="flex gap-3.5 border border-[#1E2530] pl-4">
            <LogoIcon />
            <div className="text-white">
              <div className="font-syne-Bold text-[13px]">contrib.ai assistant</div>
              <div className="text-[12px] text-[#6b7788]">context-aware - facebook/react</div>
            </div>
          </div>

          {/* where do i start */}
          <div className="flex gap-3 overflow-x-auto border border-[#1E2530] p-2 text-[11px] text-white">
            <div className="whitespace-nowrap rounded-[5px] border-2 border-[#1E2530] bg-[#11141C] px-2 text-[#828FAC]">Where do I start?</div>
            <div className="whitespace-nowrap rounded-[5px] border-2 border-[#1E2530] bg-[#11141C] px-2 text-[#828FAC]">Explain the architecture</div>
            <div className="whitespace-nowrap rounded-[5px] border-2 border-[#1E2530] bg-[#11141C] px-2 text-[#828FAC]">Find a good first issue</div>
            <div className="whitespace-nowrap rounded-[5px] border-2 border-[#1E2530] bg-[#11141C] px-2 text-[#828FAC]">How do I run this locally?</div>
          </div>

          {/* chat app */}
          <div className="flex min-h-[60vh] flex-1 flex-col gap-2 overflow-y-auto p-3.5 py-auto">
            {messages.map((msg: Message, i: number) => (
              <div
                key={i}
                className={`max-w-xs rounded-lg px-4 py-2 text-[14px] text-white ${msg.sender === "user" ? "ml-auto border border-[#1e2530] bg-[#11141c]" : "border-2 border-[#2a3048] bg-[#1a2035]"
                  }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* input box */}
          <div className="flex h-[10vh] items-center justify-around border-2 border-[#1E2530] px-4 pr-4">
            <input
              type="text"
              onKeyDown={handleKeyDown}
              value={querry}
              onChange={(e) => { updatequerry(e.target.value) }}
              placeholder="Ask anything about this repo..."
              className="h-[65%] min-w-[95%] rounded-2xl border-2 border-[#1E2530] pl-3 text-white"
            />

            <button onClick={sendQuerry} className="cursor-pointer">
              <SendIcon />
            </button>
          </div>
        </section>

        <aside className="flex max-h-screen flex-col border-t border-[#1E2530] bg-[#0d0f14] xl:border-l xl:border-t-0">
          <div className="border-b border-[#1E2530] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-syne-Bold text-[13px] text-white">Repo issues</div>
                <div className="text-[12px] text-[#6b7788]">{filteredIssues.length} matching issues</div>
              </div>
              <div className="rounded-[5px] border border-[#2a3048] bg-[#11141C] px-2 py-1 text-[11px] text-[#828FAC]">
                frontend only
              </div>
            </div>
          </div>

          <div className="border-b border-[#1E2530] px-4 py-3">
            <div className="mb-2 text-[11px] uppercase text-[#6b7788]">Labels</div>
            <div className="flex flex-wrap gap-2">
              {["All", ...issueLabels].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveLabel(label)}
                  className={`rounded-[5px] border px-2 py-1 text-[11px] transition ${activeLabel === label
                    ? "border-[#4c5f92] bg-[#1a2035] text-white"
                    : "border-[#1E2530] bg-[#11141C] text-[#828FAC] hover:border-[#2a3048] hover:text-white"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {filteredIssues.map((issue) => (
              <article key={issue.id} className="rounded-[8px] border border-[#1E2530] bg-[#11141C] p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-syne-jetBrains text-[11px] text-[#6b7788]">#{issue.number}</span>
                  <span className={`rounded-[5px] border px-2 py-0.5 text-[10px] ${issue.status === "open"
                    ? "border-[#244f38] bg-[#102018] text-[#7ed9a4]"
                    : "border-[#4c3f25] bg-[#211a10] text-[#d7b46a]"
                    }`}>
                    {issue.status}
                  </span>
                </div>
                <h2 className="text-[13px] leading-5 text-white">{issue.title}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {issue.labels.map((label) => (
                    <span key={label} className="rounded-[5px] border border-[#2a3048] bg-[#1a2035] px-2 py-0.5 text-[10px] text-[#AAB5CC]">
                      {label}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-[11px] text-[#6b7788]">Updated {issue.updatedAt}</div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AiChatBox;
