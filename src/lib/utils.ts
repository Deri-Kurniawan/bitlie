import { Function } from "../types/globals";

const fs = require("fs");
const path = require("path");

/**
 * Get package.json file from root directory
 */
const getPackageJson: Function = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join("package.json"), "utf-8", (err: any, data: any) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

/**
 * Beautify JSON
 */
const jsonBeautify: Function<
  {
    json: string;
    space?: number;
  },
  string
> = (json, space = 2) => JSON.stringify(json, null, space);

module.exports = {
  getPackageJson,
  jsonBeautify,
};
