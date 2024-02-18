import { type Request, type Response } from "express";
import { HttpStatusCode } from "../../lib/http-status-code";
import { getPackageJson } from "../../lib/utils";

export async function handleGetIndex(req: Request, res: Response) {
  try {
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
        api: [
          {
            index: {
              redirect: {
                description: "Redirect to the original URL",
                method: "GET",
                url: "/:alias",
                query: {
                  nc: {
                    type: "string",
                    description: "No Click",
                    default: "0",
                    options: ["0", "1"],
                  },
                },
              },
            },
          },
          {
            app: {
              info: {
                description: "Get app info",
                method: "GET",
                url: "/api/app",
              },
            },
          },
          {
            links: {
              list: {
                description: "Get all links",
                method: "GET",
                url: "/api/links",
                query: {
                  sort_by: {
                    type: "string",
                    description: "Sort by",
                    default: "createdAt",
                    options: ["name", "alias", "url", "createdAt", "updatedAt"],
                  },
                  order: {
                    type: "string",
                    description: "Order",
                    default: "asc",
                    options: ["asc", "desc"],
                  },
                  with_clicks: {
                    type: "string",
                    description: "With clicks",
                    default: "0",
                    options: ["0", "1"],
                  },
                },
              },
              create: {
                method: "POST",
                url: "/api/links",
                description: "Create a new link",
                body: {
                  name: {
                    type: "string",
                    description: "Name",
                  },
                  alias: {
                    type: "string",
                    description: "Alias",
                  },
                  url: {
                    type: "string",
                    description: "URL",
                  },
                },
              },
              details: {
                method: "GET",
                url: "/api/links/:id",
                description: "Get link details",
              },
              update: {
                method: "PUT",
                url: "/api/links/:id",
                description: "Update a link",
                body: {
                  name: {
                    type: "string",
                    description: "Name",
                  },
                  alias: {
                    type: "string",
                    description: "Alias",
                  },
                  url: {
                    type: "string",
                    description: "URL",
                  },
                },
              },
              delete: {
                method: "DELETE",
                url: "/api/links/:id",
                description: "Delete a link",
              },
              deleteMany: {
                method: "DELETE",
                url: "/api/links",
                description: "Delete many links",
                body: {
                  ids: {
                    type: "array",
                    description: "Array of IDs",
                  },
                },
              },
            },
          },
        ],
      },
    };

    res
      .setHeader("Content-Type", "application/json")
      .status(HttpStatusCode.OK)
      .json(responseBuilder);
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .setHeader("Content-Type", "application/json")
      .json({
        error: {
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Server Error",
        },
      });
  }
}
