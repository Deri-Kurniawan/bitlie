import fs from "fs";
import path from "path";
import { HttpStatusCode } from "./http-status-code";

/**
 * Get package.json file from root directory
 */
export const getPackageJson = (): any => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join("package.json"), "utf-8", (err: any, data: any) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

type responseSchema = {
  code?: number | HttpStatusCode.OK;
  status?: string | "success" | "error";
  message?: string;
  errors?: any;
  data?: any;
};

export const responseSchema = ({
  code = HttpStatusCode.OK,
  status = "success",
  message = "",
  data = null,
  errors = null,
}: responseSchema) => {
  return {
    code,
    status,
    message,
    data,
    errors,
  };
};

export * from "./http-status-code";
export * from "./prisma";
