import { Request, Response } from "express";
import { z } from "zod";
import { HttpStatusCode } from "../../lib/http-status-code";
import prisma from "../../lib/prisma";

export async function handleLinkRedirect(req: Request, res: Response) {
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

    await prisma.click.create({
      data: {
        linkId: findLink.id,
        ipAddress,
        userAgent: req.headers["user-agent"],
        referer: req.headers["referer"],
        platform: platform?.replace(/"/g, ""),
      },
    });

    res.status(301).redirect(findLink.url);
  } else {
    res.status(HttpStatusCode.NOT_FOUND).json({
      code: HttpStatusCode.NOT_FOUND,
      status: "error",
      message: "Link not found",
    });
  }
}

export async function handleGetLinks(req: Request, res: Response) {
  const inputSchema = z
    .object({
      sort_by: z
        .enum(["name", "alias", "url", "createdAt", "updatedAt"])
        .default("createdAt")
        .optional(),
      order: z.enum(["asc", "desc"]).default("asc").optional(),
      with_clicks: z.enum(["1", "0"]).optional(),
    })
    .safeParse(req.query);

  if (!inputSchema.success) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      code: HttpStatusCode.BAD_REQUEST,
      status: "error",
      message: "Bad Request",
      errors: [
        ...inputSchema.error.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        })),
      ],
    });
    return;
  }

  const {
    sort_by = "createdAt",
    order = "asc",
    with_clicks = "0",
  } = inputSchema.data;

  const data = await prisma.link.findMany({
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

  res
    .setHeader("Content-Type", "application/json")
    .status(HttpStatusCode.OK)
    .send({
      code: HttpStatusCode.OK,
      status: "success",
      message: "Links retrieved successfully",
      data,
    });
}

export async function handleLinkCreate(req: Request, res: Response) {
  const { name, alias, url } = req.body;

  if (alias) {
    const isLinkAlreadyExist = await prisma.link.findFirst({
      where: {
        alias,
      },
    });

    if (isLinkAlreadyExist) {
      res.status(HttpStatusCode.CONFLICT).send({
        code: HttpStatusCode.CONFLICT,
        status: "error",
        message: "Alias already taken",
      });
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

  const response: {
    code: number;
    status: string;
    message: string;
    data?: any;
    errors?: any;
  } = {
    code: HttpStatusCode.CREATED,
    status: "success",
    message: "Link created successfully",
  };

  if (created) {
    if (req.query.refetch == "1") {
      const links = await prisma.link.findMany();
      response.data = links;
    }

    res.status(response.code).json(response);
  } else {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      status: "error",
      message: "Internal Server Error",
    });
  }
}

export async function handleGetLinkDetails(req: Request, res: Response) {
  const { id } = req.params;

  const findExistingLink = await prisma.link.findFirst({
    where: {
      id,
    },
  });

  if (!findExistingLink) {
    res.status(HttpStatusCode.NOT_FOUND).json({
      code: HttpStatusCode.NOT_FOUND,
      status: "error",
      message: "Link not found",
    });
    return;
  }

  res.status(HttpStatusCode.OK).json({
    code: HttpStatusCode.OK,
    status: "success",
    message: "Link details retrieved successfully",
    data: findExistingLink,
  });
}

export async function handleLinkUpdate(req: Request, res: Response) {
  const { id } = req.params;
  const { name, alias, url } = req.body;

  const findExistingLink = await prisma.link.findFirst({
    where: {
      id,
    },
  });

  if (!findExistingLink) {
    res.status(HttpStatusCode.NOT_FOUND).json({
      code: HttpStatusCode.NOT_FOUND,
      status: "error",
      message: "Link not found",
    });
    return;
  }

  const findExistingLinkByAlias = await prisma.link.findFirst({
    where: {
      alias,
    },
  });

  if (findExistingLinkByAlias && findExistingLinkByAlias.id !== id) {
    res.status(HttpStatusCode.CONFLICT).send({
      code: HttpStatusCode.CONFLICT,
      status: "error",
      message: "Alias already taken",
    });
    return;
  }

  const updated = await prisma.link.update({
    where: {
      id,
    },
    data: {
      name,
      alias,
      url,
    },
  });

  const responseBuilder: {
    code: number;
    status: string;
    message: string;
    data?: any;
    errors?: any;
  } = {
    code: HttpStatusCode.OK,
    status: "success",
    message: "Link updated successfully",
  };

  if (updated) {
    if (req.query.refetch == "1") {
      const links = await prisma.link.findMany();
      responseBuilder.data = links;
    }

    res.status(responseBuilder.code).json(responseBuilder);
  } else {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      status: "error",
      message: "Internal Server Error",
    });
  }
}

export async function handleLinkDelete(req: Request, res: Response) {
  const { id } = req.params;
  const responseBuilder: {
    code: number;
    status: string;
    message: string;
    data?: any;
    errors?: any;
  } = {
    code: HttpStatusCode.OK,
    status: "success",
    message: "Link deleted successfully",
  };

  const deleteLink = await prisma.link.delete({
    where: {
      id,
    },
  });

  if (deleteLink) {
    if (req.query.refetch == "1") {
      const links = await prisma.link.findMany();
      responseBuilder.data = links;
    }

    res.status(responseBuilder.code).json(responseBuilder);
  } else {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      status: "error",
      message: "Internal Server Error",
    });
  }
}
