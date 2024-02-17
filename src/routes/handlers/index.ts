import { type Request, type Response } from "express";
import { HttpStatusCode } from "../../lib/http-status-code";
import { getPackageJson } from "../../lib/utils";

export async function handleGetAppInfo(req: Request, res: Response) {
  const { name, version, description, repository, author, license } =
    await getPackageJson();

  const responseBuilder = {
    code: HttpStatusCode.OK,
    status: "success",
    message: "Welcome to the Bitlie RESTful API",
    data: {
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
      },
      api: {
        Authorization: "Bearer <token>",
        "/": {
          GET: {
            description: "Visit the short URL",
            endpoint: `${req.baseUrl}/:alias`,
            query: {
              sort_by: {
                description: "Sort by field",
                default: "createdAt",
                accepted: ["name", "alias", "url", "createdAt", "updatedAt"],
              },
              order: {
                description: "Sort order",
                default: "asc",
                accepted: ["asc", "desc"],
              },
              with_clicks: {
                description: "Include clicks data",
                default: "0",
                accepted: ["1", "0"],
              },
            },
          },
        },
        stats: {
          GET: {
            description: "Retrieve app stats",
            endpoint: `${req.baseUrl}/api/stats`,
          },
        },
        links: {
          GET: {
            description: "Retrieve all links",
            endpoint: `${req.baseUrl}/api/links`,
          },
          POST: {
            description: "Create a new link",
            endpoint: `${req.baseUrl}/api/links`,
          },
          PUT: {
            description: "Update an existing link",
            endpoint: `${req.baseUrl}/api/links/:id`,
          },
          DELETE: {
            description: "Delete an existing link",
            endpoint: `${req.baseUrl}/api/links/:id`,
          },
        },
      },
    },
  };

  res
    .setHeader("Content-Type", "application/json")
    .status(HttpStatusCode.OK)
    .json(responseBuilder);
}
