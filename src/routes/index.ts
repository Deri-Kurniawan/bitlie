import express, { type Request, type Response } from "express";
import path from "path";
import { handleGetIndex } from "../handlers";
import { HttpStatusCode } from "../lib/http-status-code";

const indexRouter = express.Router();

indexRouter.get("/", handleGetIndex);

indexRouter.get("/LICENSE", (_: Request, res: Response) => {
  res
    .setHeader("Content-Type", "text/plain")
    .status(HttpStatusCode.OK)
    .sendFile(path.join(__dirname, "../LICENSE"));
});

export default indexRouter;
