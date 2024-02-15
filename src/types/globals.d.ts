import type { NextFunction, Request, Response } from "express";
export type Route = {
  path: string;
  method: "get" | "post" | "put" | "delete" | "all";
  middleware?: ((req: Request, res: Response, next: NextFunction) => any)[];
  handler: (req: Request, res: Response) => any;
};
