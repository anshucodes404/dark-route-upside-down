import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from "cookie-parser"
import userRouter from './routes/user.route';
import animalRouter from './routes/animal.route';
import farmerRouter from './routes/farmer.route';
import vetRouter from './routes/vet.route';


const app = express();

const localOrigin = 'http://localhost:3000';
const hostOrigin = 'https://upside-down.vercel.app';

app.use(cors({
  origin: [localOrigin, hostOrigin],
  credentials: true
}))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser())

app.get("/wake", (req, res: Response) => {
  res.json({
    message: "Server is awake!",
    timestamp: new Date().toISOString(),
    status: "active"
  });
});


app.use("/api/user", userRouter);
app.use("/api/animal", animalRouter);
app.use("/api/farmer", farmerRouter)
app.use("/api/vet", vetRouter)


export default app;