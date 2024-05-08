import consola from "consola";
import express, { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma";
import { HttpStatusCode, responseSchema } from "../../lib/utils";
import { middlewareVerifyToken } from "../../middlewares/token";

const apiClickRouter = express.Router();

apiClickRouter.get(
  "/api/clicks",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const querySchema = z
        .object({
          order: z.enum(["asc", "desc"]).default("desc").optional(),
          sort_by: z
            .enum([
              "ipAddress",
              "userAgent",
              "referer",
              "platform",
              "createdAt",
              "updatedAt",
            ])
            .default("createdAt")
            .optional(),
          limit: z.string().default("100").optional(),
          with_links: z.enum(["1", "0"]).default("0").optional(),
        })
        .safeParse(req.query);

      if (!querySchema.success) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(
          responseSchema({
            code: HttpStatusCode.BAD_REQUEST,
            status: "error",
            message: "Invalid input",
            errors: querySchema.error,
          })
        );
      }

      const {
        limit = 100,
        order = "asc",
        sort_by = "createdAt",
        with_links = "0",
      } = querySchema.data;

      const clicks = await prisma.click.findMany({
        take: Number(limit),
        orderBy: {
          [sort_by]: order,
        },
        include: {
          link: with_links === "1",
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Clicks retrieved successfully",
          data: clicks,
        })
      );
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
  }
);

apiClickRouter.delete(
  "/api/clicks/:id",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const isClickExist = await prisma.click.findFirst({
        where: {
          id,
        },
      });

      if (!isClickExist) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Click not found",
          })
        );
        return;
      }

      await prisma.click.delete({
        where: {
          id,
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Click deleted successfully",
        })
      );
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
  }
);

export default apiClickRouter;
