import express from "express";
import {
  handleGetLinkDetails,
  handleGetLinks,
  handleLinkCreate,
  handleLinkDelete,
  handleLinkDeleteMany,
  handleLinkUpdate,
} from "../../handlers/links";
import { middlewareVerifyToken } from "../../middlewares/token";

const apiLinksRouter = express.Router();

apiLinksRouter.get(
  "/api/links/:id",
  middlewareVerifyToken,
  handleGetLinkDetails
);
apiLinksRouter.get("/api/links", middlewareVerifyToken, handleGetLinks);
apiLinksRouter.post("/api/links", middlewareVerifyToken, handleLinkCreate);
apiLinksRouter.put("/api/links/:id", middlewareVerifyToken, handleLinkUpdate);
apiLinksRouter.delete(
  "/api/links/:id",
  middlewareVerifyToken,
  handleLinkDelete
);
apiLinksRouter.delete(
  "/api/links",
  middlewareVerifyToken,
  handleLinkDeleteMany
);

export default apiLinksRouter;
