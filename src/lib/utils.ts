import fs from "fs";
import path from "path";

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

export * from "./prisma";
