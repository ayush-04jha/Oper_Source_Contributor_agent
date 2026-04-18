import axios from "axios";

export const chatHandler = (socket) => {

  socket.on("querry_sent", async (msg) => {
    try {
      console.log("query reached to server:", msg);
      // ai logic
      const response = await (axios.post("http://localhost:8000/chat", {
        querry: msg.querry
      }))
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

