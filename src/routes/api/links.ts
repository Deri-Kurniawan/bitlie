import consola from "consola";
import express, { Request, Response } from "express";
import { z } from "zod";
import { HttpStatusCode } from "../../lib/http-status-code";
import prisma from "../../lib/prisma";
import { responseSchema } from "../../lib/utils";
import { middlewareVerifyToken } from "../../middlewares/token";

const apiLinksRouter = express.Router();

apiLinksRouter.get(
  "/api/links",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    const querySchema = z
      .object({
        sort_by: z
          .enum(["name", "alias", "url", "createdAt", "updatedAt"])
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
        with_clicks = "0",
        limit = "100",
      } = querySchema.data;

      const data = await prisma.link.findMany({
        take: Number(limit),
        orderBy: {
          [String(sort_by)]: order,
        },
        include: {
          clicks: with_clicks === "1",
          _count: {
            select: {
              clicks: true,
            },
          },
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Links retrieved successfully",
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

apiLinksRouter.get(
  "/api/links/:id",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const findExistingLink = await prisma.link.findFirst({
        where: {
          id,
        },
      });

      if (!findExistingLink) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Link not found",
          })
        );
        return;
      }

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Link details retrieved successfully",
          data: findExistingLink,
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

apiLinksRouter.post(
  "/api/links",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    const bodySchema = z
      .object({
        name: z
          .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
          })
          .min(1, "Name is required"),
        alias: z
          .string({
            required_error: "Alias is required",
            invalid_type_error: "Alias must be a string",
          })
          .min(1, "Alias is required")
          .regex(
            /^[a-zA-Z0-9-_]+$/,
            "Alias must be alphanumeric and hyphens and underscores only"
          ),
        url: z
          .string({
            required_error: "URL is required",
            invalid_type_error: "URL must be a string",
          })
          .regex(
            /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\d{2,5})?@)?(?:localhost|(?!localhost)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))))(?::\d{2,5})?(?:[/?#]\S*)?$/,
            "URL is invalid"
          ),
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
      const { name, alias, url } = bodySchema.data;

      if (alias) {
        const isLinkAlreadyExist = await prisma.link.findFirst({
          where: {
            alias,
          },
        });

        if (isLinkAlreadyExist) {
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

      const created = await prisma.link.create({
        data: {
          name,
          alias,
          url,
        },
      });

      res.status(HttpStatusCode.CREATED).json(
        responseSchema({
          code: HttpStatusCode.CREATED,
          message: "Link created successfully",
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

apiLinksRouter.put(
  "/api/links/:id",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    const bodySchema = z
      .object({
        name: z
          .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
          })
          .min(1, "Name is required"),
        alias: z
          .string({
            required_error: "Alias is required",
            invalid_type_error: "Alias must be a string",
          })
          .min(1, "Alias is required")
          .regex(
            /^[a-zA-Z0-9-_]+$/,
            "Alias must be alphanumeric and hyphens and underscores only"
          ),
        url: z
          .string({
            required_error: "URL is required",
            invalid_type_error: "URL must be a string",
          })
          .regex(
            /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\d{2,5})?@)?(?:localhost|(?!localhost)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))))(?::\d{2,5})?(?:[/?#]\S*)?$/,
            "URL is invalid"
          ),
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
      const { name, alias, url } = bodySchema.data;

      const findExistingLink = await prisma.link.findFirst({
        where: {
          id,
        },
      });

      if (!findExistingLink) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Link not found",
          })
        );
        return;
      }

      const findExistingLinkByAlias = await prisma.link.findFirst({
        where: {
          alias,
        },
      });

      if (findExistingLinkByAlias && findExistingLinkByAlias.id !== id) {
        res.status(HttpStatusCode.CONFLICT).json(
          responseSchema({
            code: HttpStatusCode.CONFLICT,
            status: "error",
            message: "Alias already taken",
          })
        );
        return;
      }

      await prisma.link.update({
        where: {
          id,
        },
        data: {
          name,
          alias,
          url,
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Link updated successfully",
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

apiLinksRouter.delete(
  "/api/links/:id",
  middlewareVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const isLinkExist = await prisma.link.findFirst({
        where: {
          id,
        },
      });

      if (!isLinkExist) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Link not found",
          })
        );
        return;
      }

      await prisma.link.delete({
        where: {
          id,
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Link deleted successfully",
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

apiLinksRouter.delete(
  "/api/links",
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

      const findManyLink = await prisma.link.findMany({
        where: {
          id: {
            in: req.body.ids,
          },
        },
      });

      if (findManyLink.length !== req.body.ids.length) {
        res.status(HttpStatusCode.NOT_FOUND).json(
          responseSchema({
            code: HttpStatusCode.NOT_FOUND,
            status: "error",
            message: "Link not found",
          })
        );
        return;
      }

      await prisma.link.deleteMany({
        where: {
          id: {
            in: req.body.ids,
          },
        },
      });

      res.status(HttpStatusCode.OK).json(
        responseSchema({
          message: "Link deleted successfully",
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

export default apiLinksRouter;
