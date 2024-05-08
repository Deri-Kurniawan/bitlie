import express, { Request, Response } from "express";
import { handleLinkRedirect } from "../../handlers/links";
import { HttpStatusCode } from "../../lib/http-status-code";
import { getPackageJson } from "../../lib/utils";

const apiIndexRouter = express.Router();

apiIndexRouter.get("/api", async (_: Request, res: Response) => {
  const packageJson = await getPackageJson();
  res
    .status(HttpStatusCode.OK)
    .setHeader("Content-Type", "application/json")
    .json({
      message: "Welcome to the API!",
      version: packageJson.version,
    });
});

apiIndexRouter.get("/:alias", handleLinkRedirect);

export default apiIndexRouter;
