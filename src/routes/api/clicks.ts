import express from "express";
import { handleClickDelete, handleGetClicks } from "../../handlers/clicks";
import { middlewareVerifyToken } from "../../middlewares/token";

const apiClickRouter = express.Router();

apiClickRouter.get("/api/clicks/:id", middlewareVerifyToken, handleGetClicks);

apiClickRouter.delete(
  "/api/clicks/:id",
  middlewareVerifyToken,
  handleClickDelete
);

export default apiClickRouter;
