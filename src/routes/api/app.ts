import express from "express";
import { handleGetAppInfo } from "../../handlers/app";
import { middlewareVerifyToken } from "../../middlewares/token";

const apiAppRouter = express.Router();

apiAppRouter.get("/api/app", middlewareVerifyToken, handleGetAppInfo);

export default apiAppRouter;
