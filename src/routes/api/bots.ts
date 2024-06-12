import consola from "consola";
import express, { Request, Response } from "express";
import { z } from "zod";
import { HttpStatusCode } from "../../lib/http-status-code";
import prisma from "../../lib/prisma";
import { responseSchema } from "../../lib/utils";
import { middlewareVerifyToken } from "../../middlewares/token";

const apiBotsRouter = express.Router();

apiBotsRouter.get(
  "/api/bots",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    const querySchema = z
      .object({
        sort_by: z
          .enum(["userAgent", "createdAt", "updatedAt"])
          .default("createdAt")
          .optional(),
        order: z.enum(["asc", "desc"]).default("asc").optional(),
        with_clicks: z.enum(["1", "0"]).default("0").optional(),
        limit: z.string().default("100").optional(),
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

    try {
      const {
        sort_by = "createdAt",
        order = "asc",
        limit = "100",
      } = querySchema.data;

      const data = await prisma.bot.findMany({
        take: Number(limit),
        orderBy: {
          [String(sort_by)]: order,
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Bots retrieved successfully",
          data,
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

apiBotsRouter.get(
  "/api/bots/:id",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const findExistingBot = await prisma.bot.findFirst({
        where: {
          id,
        },
      });

      if (!findExistingBot) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Bot not found",
          })
        );
        return;
      }

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Bot details retrieved successfully",
          data: findExistingBot,
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

apiBotsRouter.post(
  "/api/bots",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    const bodySchema = z
      .object({
        userAgent: z
          .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
          })
          .min(1, "Name is required"),
      })
      .safeParse(req.body);

    if (!bodySchema.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        responseSchema({
          code: HttpStatusCode.BAD_REQUEST,
          status: "error",
          message: "Bad Request",
          errors: [
            ...bodySchema.error.errors.map((error) => ({
              path: error.path.join("."),
              message: error.message,
            })),
          ],
        })
      );
      return;
    }

    try {
      const { userAgent } = bodySchema.data;

      if (userAgent) {
        const isBotAlreadyExist = await prisma.bot.findFirst({
          where: {
            userAgent,
          },
        });

        if (isBotAlreadyExist) {
          res.status(HttpStatusCode.CONFLICT).json(
            responseSchema({
              code: HttpStatusCode.CONFLICT,
              status: "error",
              message: "Alias already taken",
            })
          );
          return;
        }
      }

      const created = await prisma.bot.create({
        data: {
          userAgent,
        },
      });

      res.status(HttpStatusCode.CREATED).json(
        responseSchema({
          code: HttpStatusCode.CREATED,
          message: "Bot created successfully",
          data: created,
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

apiBotsRouter.put(
  "/api/bots/:id",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    const bodySchema = z
      .object({
        userAgent: z
          .string({
            required_error: "User Agent is required",
            invalid_type_error: "User Agent must be a string",
          })
          .min(1, "User Agent is required"),
      })
      .safeParse(req.body);

    if (!bodySchema.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        responseSchema({
          code: HttpStatusCode.BAD_REQUEST,
          status: "error",
          message: "Bad Request",
          errors: [
            ...bodySchema.error.errors.map((error) => ({
              path: error.path.join("."),
              message: error.message,
            })),
          ],
        })
      );
      return;
    }

    try {
      const { id } = req.params;
      const { userAgent } = bodySchema.data;

      const findExistingBot = await prisma.bot.findFirst({
        where: {
          id,
        },
      });

      if (!findExistingBot) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Bot not found",
          })
        );
        return;
      }

      const findExistingBotByAlias = await prisma.bot.findFirst({
        where: {
          userAgent,
        },
      });

      if (findExistingBotByAlias && findExistingBotByAlias.id !== id) {
        res.status(HttpStatusCode.CONFLICT).json(
          responseSchema({
            code: HttpStatusCode.CONFLICT,
            status: "error",
            message: "User Agent already exist",
          })
        );
        return;
      }

      await prisma.bot.update({
        where: {
          id,
        },
        data: {
          userAgent,
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Bot updated successfully",
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

apiBotsRouter.delete(
  "/api/bots/:id",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const isBotExist = await prisma.bot.findFirst({
        where: {
          id,
        },
      });

      if (!isBotExist) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Bot not found",
          })
        );
        return;
      }

      await prisma.bot.delete({
        where: {
          id,
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Bot deleted successfully",
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

apiBotsRouter.delete(
  "/api/bots",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const bodySchema = z
        .object({
          ids: z.array(z.string()).min(1, "ID is required"),
        })
        .safeParse(req.body);

      if (!bodySchema.success) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          responseSchema({
            code: HttpStatusCode.BAD_REQUEST,
            status: "error",
            message: "Bad Request",
            errors: [
              ...bodySchema.error.errors.map((error) => ({
                path: error.path.join("."),
                message: error.message,
              })),
            ],
          })
        );
        return;
      }

      const findManyBot = await prisma.bot.findMany({
        where: {
          id: {
            in: req.body.ids,
          },
        },
      });

      if (findManyBot.length !== req.body.ids.length) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Bot not found",
          })
        );
        return;
      }

      await prisma.bot.deleteMany({
        where: {
          id: {
            in: req.body.ids,
          },
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Bot deleted successfully",
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

export default apiBotsRouter;
