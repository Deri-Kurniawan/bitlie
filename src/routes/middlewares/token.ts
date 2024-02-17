import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../lib/http-status-code";
import prisma from "../../lib/prisma";

export async function middlewareVerifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenAttached = req.headers.authorization?.slice(7);
  const isTokenExist = await prisma.token.findFirst({
    where: {
      token: tokenAttached,
    },
  });

  if (!tokenAttached || !isTokenExist) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      code: HttpStatusCode.UNAUTHORIZED,
      status: "error",
      message: "Unauthorized",
    });
    return;
  }
  next();
}
