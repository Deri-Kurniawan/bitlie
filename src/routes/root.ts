import { type Request, type Response } from "express";
import path from "path";
import { HttpStatusCode } from "../lib/http-status-code";
import { Route } from "../types/globals";
import { handleGetAppInfo } from "./handlers";
import {
  handleGetLinkDetails,
  handleGetLinks,
  handleLinkCreate,
  handleLinkDelete,
  handleLinkDeleteMany,
  handleLinkRedirect,
  handleLinkUpdate,
} from "./handlers/links";
import { handleGetStats } from "./handlers/stats";
import {
  middlewareLinkCreateRequestValidator,
  middlewareLinkDeleteRequestValidator,
  middlewareLinkUpdateRequestValidator,
} from "./middlewares/links";
import { middlewareVerifyToken } from "./middlewares/token";

export const routes: Route[] = [
  {
    path: "/",
    method: "get",
    handler: handleGetAppInfo,
  },

  {
    path: "/LICENSE",
    method: "get",
    handler: (_: Request, res: Response) => {
      res
        .setHeader("Content-Type", "text/plain")
        .status(HttpStatusCode.OK)
        .sendFile(path.join(__dirname, "../../LICENSE"));
    },
  },
  // stats
  {
    path: "/api/stats",
    method: "get",
    middleware: [middlewareVerifyToken],
    handler: handleGetStats,
  },
  // end of stats

  // links
  {
    path: "/api/links/:id",
    method: "get",
    middleware: [middlewareVerifyToken],
    handler: handleGetLinkDetails,
  },

  {
    path: "/api/links",
    method: "get",
    middleware: [middlewareVerifyToken],
    handler: handleGetLinks,
  },

  {
    path: "/api/links",
    method: "post",
    middleware: [middlewareVerifyToken, middlewareLinkCreateRequestValidator],
    handler: handleLinkCreate,
  },

  {
    path: "/api/links/:id",
    method: "put",
    middleware: [middlewareVerifyToken, middlewareLinkUpdateRequestValidator],
    handler: handleLinkUpdate,
  },

  {
    path: "/api/links/:id",
    method: "delete",
    middleware: [middlewareVerifyToken, middlewareLinkDeleteRequestValidator],
    handler: handleLinkDelete,
  },

  {
    path: "/api/links",
    method: "delete",
    middleware: [middlewareVerifyToken],
    handler: handleLinkDeleteMany,
  },
  // end of links

  {
    path: "/api",
    method: "get",
    handler: (_: Request, res: Response) => {
      res
        .status(HttpStatusCode.OK)
        .setHeader("Content-Type", "application/json")
        .json({
          message: "Welcome to the API!",
          version: "1.0.0",
        });
    },
  },

  {
    path: "/:alias",
    method: "get",
    handler: handleLinkRedirect,
  },

  // 404 Not Found
  {
    path: "*",
    method: "all",
    handler: (_: Request, res: Response) => {
      res
        .status(HttpStatusCode.NOT_FOUND)
        .setHeader("Content-Type", "application/json")
        .json({
          error: {
            code: HttpStatusCode.NOT_FOUND,
            message: "Sorry, the requested resource could not be found.",
          },
        });
    },
  },
];
