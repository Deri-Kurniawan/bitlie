import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import path from "path";
import { HttpStatusCode } from "./lib/http-status-code";
import indexRouter from "./routes";
import apiIndexRouter from "./routes/api";
import apiAppRouter from "./routes/api/app";
import apiClickRouter from "./routes/api/clicks";
import apiLinksRouter from "./routes/api/links";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((_: Request, res: Response, next: NextFunction) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

// Routes
app.use([
  indexRouter,
  apiAppRouter,
  apiClickRouter,
  apiLinksRouter,
  apiIndexRouter,
]);

app.all("*", (_: Request, res: Response) => {
  res
    .status(HttpStatusCode.NOT_FOUND)
    .setHeader("Content-Type", "application/json")
    .json({
      error: {
        code: HttpStatusCode.NOT_FOUND,
        message: "Sorry, the requested resource could not be found.",
      },
    });
});

server.listen(port, (): void => {
  console.log(`[server]: Server is running at http://[::1]:${port}`);
});

export default app;
