import express from "express";
import http from "http";
import cors from "cors";
import urlProcessingRouter from "./routes/urlProcessingRouter.js"
import { initSocket } from "./socket.js";
const app = express()
console.log("this is app",app);

const server = http.createServer(app) 
initSocket(server);
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