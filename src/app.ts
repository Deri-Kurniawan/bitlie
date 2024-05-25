import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { HttpStatusCode, responseSchema } from "./lib/utils";
import indexRouter from "./routes";
import apiAppRouter from "./routes/api/app";
import apiClickRouter from "./routes/api/clicks";
import apiLinksRouter from "./routes/api/links";
import apiIndexRedirectRouter from "./routes/index-redirect";
import helmet from "helmet";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(
  helmet({
    hidePoweredBy: true,
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use([
  indexRouter,
  apiAppRouter,
  apiClickRouter,
  apiLinksRouter,
  apiIndexRedirectRouter,
]);

app.all("*", (_: Request, res: Response) => {
  res
    .status(HttpStatusCode.NOT_FOUND)
    .setHeader("Content-Type", "application/json")
    .json(
      responseSchema({
        code: HttpStatusCode.NOT_FOUND,
        status: "error",
        message: "Sorry, the requested resource could not be found.",
      })
    );
});

export default app;
