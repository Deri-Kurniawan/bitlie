import { type Request, type Response } from "express";
import path from "path";
import { HttpStatusCode } from "../lib/http-status-code";
import { Route } from "../types/globals";
import { handleGetIndex } from "./handlers";
import { handleGetAppInfo } from "./handlers/app";
import { handleClickDelete, handleGetClicks } from "./handlers/clicks";
import {
  handleGetLinkDetails,
  handleGetLinks,
  handleLinkCreate,
  handleLinkDelete,
  handleLinkDeleteMany,
  handleLinkRedirect,
  handleLinkUpdate,
} from "./handlers/links";
import { middlewareVerifyToken } from "./middlewares/token";

export const routes: Route[] = [
  {
    path: "/",
    method: "get",
    handler: handleGetIndex,
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
  // app info
  {
    path: "/api/app",
    method: "get",
    middleware: [middlewareVerifyToken],
    handler: handleGetAppInfo,
  },
  // end of app info

  // clicks
  {
    path: "/api/clicks",
    method: "get",
    middleware: [middlewareVerifyToken],
    handler: handleGetClicks,
  },
  {
    path: "/api/clicks/:id",
    method: "delete",
    middleware: [middlewareVerifyToken],
    handler: handleClickDelete,
  },
  // end of clicks

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
    middleware: [middlewareVerifyToken],
    handler: handleLinkCreate,
  },

  {
    path: "/api/links/:id",
    method: "put",
    middleware: [middlewareVerifyToken],
    handler: handleLinkUpdate,
  },

  {
    path: "/api/links/:id",
    method: "delete",
    middleware: [middlewareVerifyToken],
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
