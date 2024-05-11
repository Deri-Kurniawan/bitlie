import consola from "consola";
import express, { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma";
import {
  getPackageJson,
  HttpStatusCode,
  responseSchema,
} from "../../lib/utils";

const apiIndexRouter = express.Router();

apiIndexRouter.get("/api", async (_: Request, res: Response) => {
  const packageJson = await getPackageJson();
  res
    .status(HttpStatusCode.OK)
    .setHeader("Content-Type", "application/json")
    .json(
      responseSchema({
        message: "Welcome to the API!",
        data: {
          version: packageJson.version,
        },
      })
    );
});

apiIndexRouter.get("/:alias", async (req: Request, res: Response) => {
  const querySchema = z
    .object({
      /**
       * nc = No Click
       */
      nc: z.enum(["1", "0"]).default("0").optional(),
    })
    .safeParse(req.query);

  if (!querySchema.success) {
    res.status(HttpStatusCode.BAD_REQUEST).json(
      responseSchema({
        code: HttpStatusCode.BAD_REQUEST,
        status: "error",
        message: "Bad Request",
        errors: [
          ...querySchema.error.errors.map((error) => ({
            path: error.path.join("."),
            message: error.message,
          })),
        ],
      })
    );
    return;
  }

  const { nc: noClick = "0" } = querySchema.data;

  try {
    const { alias } = req.params;
    const findLink = await prisma.link.findFirst({
      where: {
        alias,
      },
    });

    if (findLink) {
      const ipAddress = Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const platform = Array.isArray(req.headers["sec-ch-ua-platform"])
        ? req.headers["sec-ch-ua-platform"][0]
        : req.headers["sec-ch-ua-platform"];

      if (noClick === "0") {
        await prisma.click.create({
          data: {
            linkId: findLink.id,
            ipAddress,
            userAgent: req.headers["user-agent"],
            referer: req.headers["referer"],
            platform: platform?.replace(/"/g, ""),
          },
        });
      }

      res.status(HttpStatusCode.FOUND).redirect(findLink.url);
    } else {
      res.status(HttpStatusCode.NOT_FOUND).json(
        responseSchema({
          code: HttpStatusCode.NOT_FOUND,
          status: "error",
          message: "Link not found",
        })
      );
    }
  } catch (error) {
    consola.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
      responseSchema({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        status: "error",
        message: "Internal Server Error",
      })
    );
  }
});

export default apiIndexRouter;
