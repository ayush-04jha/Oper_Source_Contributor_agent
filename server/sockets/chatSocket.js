import axios from "axios";
import Conversation from "../models/chatModel.js";

export const chatHandler = (socket) => {

  socket.on("querry_sent", async (msg) => {
    try {
      console.log("query reached to server:", msg);

      if (!msg.repoId) {
        socket.emit("error", { message: "Repo id is missing. Please analyze a repo first." });
        return;
      }

      await Conversation.findByIdAndUpdate(
        msg.conversationId,
        {
          $push: {
            messages: {
              sender: "user",
              text: msg.querry,
            },
          },
        }
      );
      const response = await (axios.post("http://localhost:8000/chat", {
        querry: msg.querry,
        repo_id: msg.repoId
      }))
      await Conversation.findByIdAndUpdate(
        msg.conversationId,
        {
          $push: {
            messages: {
              sender: "bot",
              text: response.data.answer,
            },
          },
        }
      );

      // send to frontend
      socket.emit("answer_received", {
        ai_response: response.data.answer
      });
    } catch (err) {
      console.error(err);
      socket.emit("error", { message: "Server error" });
    }

  })
  //


}

