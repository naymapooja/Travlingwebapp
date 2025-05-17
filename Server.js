import express from "express";
import userRouter from "./routes/user.Router.js"
import dbConnect from './utils/dbconnect.js';
import cookieParser from "cookie-parser";
import cors from "cors";

dbConnect()
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use (cookieParser())
app.use(cors({
    origin: process.env.CLIENT_BASE_URL, 
    credentials: true, 
  }));
  
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.send("Hello world");

})
app.listen(PORT, () => {
    console.log(`Server is runing at http://localhost:${PORT}`);
})
