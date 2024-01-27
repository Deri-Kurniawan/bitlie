import type { DataProps } from "./types/globals";
import type { Request, Response } from "express";

const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { data } = require("./data/links");
const { getPackageJson, jsonBeautify } = require("./lib/utils");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  const {
    name,
    version,
    description,
    repository,
    author,
    license,
    dependencies,
    devDependencies,
  } = await getPackageJson();

  const responseBuilder = {
    app: {
      name,
      version,
      description,
      author,
      repository: repository.url.replace("git+", ""),
      license: {
        name: license,
        url: "/LICENSE",
      },
      dependencies: Object.keys(dependencies).map((key) => ({
        name: key,
        version: dependencies[key],
      })),
      devDependencies: Object.keys(devDependencies).map((key) => ({
        name: key,
        version: devDependencies[key],
      })),
    },
    data: data.map((item: DataProps) => ({
      alias: item.alias,
      aliasUrl: `${req.baseUrl}/${item.alias}`,
      targetUrl: item.targetUrl,
    })),
  };

  res
    .setHeader("Content-Type", "application/json")
    .status(200)
    .send(jsonBeautify(responseBuilder));
});

app.get("/LICENSE", (_: Request, res: Response) => {
  res
    .setHeader("Content-Type", "text/plain")
    .status(200)
    .sendFile(path.join(__dirname, "../LICENSE"));
});

app.get("/:alias", (req: Request, res: Response) => {
  const alias = req.params.alias;

  const result = data.find((item: DataProps) => item.alias === alias);

  if (!result) {
    res
      .status(404)
      .header("Content-Type", "application/json")
      .send(
        jsonBeautify({
          error: {
            code: 404,
            message:
              "Sorry, the short URL could not be located, appears to be broken, or has been removed at this time. We regret any inconvenience caused :(",
          },
        })
      );
  } else {
    // UTM parameters for tracking purpose (optional)
    // https://en.wikipedia.org/wiki/UTM_parameters
    const utmQueries = {
      utm_source: "bitlie",
      utm_medium: "redirect",
      utm_campaign: "bitlie",
    };
    res
      .status(302)
      .redirect(`${result.targetUrl}?${new URLSearchParams(utmQueries)}`);
  }
});

app.all("*", (_: Request, res: Response) => {
  res
    .status(404)
    .setHeader("Content-Type", "application/json")
    .send(
      jsonBeautify({
        error: {
          code: 404,
          message: "Sorry, the requested resource could not be found.",
        },
      })
    );
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://[::1]:${port}`);
});
