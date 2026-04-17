import express from "express";
import http from "http";
import cors from "cors";
import urlProcessingRouter from "./routes/urlProcessingRouter.js"
import { Server } from "socket.io";
const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
setupSocket(io);

app.use(express.json())
app.use(cors());
const port = 8080;
app.use('/api',urlProcessingRouter);
server.listen(port, () => {
  console.log(`Chatbot server running on port ${port}`);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});