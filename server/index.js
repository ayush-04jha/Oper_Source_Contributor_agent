import express from "express";
import cors from "cors";
import urlProcessingRouter from "./routes/urlProcessingRouter.js"
const app = express()
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5174"
}));
const port = 8080;
app.use('/api',urlProcessingRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});