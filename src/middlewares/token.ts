import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import { HttpStatusCode, responseSchema } from "../lib/utils";

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
    res.status(HttpStatusCode.UNAUTHORIZED).json(
      responseSchema({
        code: HttpStatusCode.UNAUTHORIZED,
        status: "error",
        message: "Unauthorized",
      })
    );
    return;
  }
  next();
}
