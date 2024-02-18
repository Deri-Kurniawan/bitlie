import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { z } from "zod";
import { HttpStatusCode } from "../../lib/http-status-code";

export async function handleGetClicks(req: Request, res: Response) {
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
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Invalid input",
        errors: querySchema.error,
      });
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

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Clicks retrieved successfully",
      data: clicks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
}

export async function handleClickDelete(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const isClickExist = await prisma.click.findFirst({
      where: {
        id,
      },
    });

    if (!isClickExist) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        code: HttpStatusCode.NOT_FOUND,
        status: "error",
        message: "Click not found",
      });
      return;
    }

    await prisma.click.delete({
      where: {
        id,
      },
    });

    res.status(HttpStatusCode.OK).json({
      code: HttpStatusCode.OK,
      status: "success",
      message: "Click deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      status: "error",
      message: "Internal Server Error",
    });
  }
}
