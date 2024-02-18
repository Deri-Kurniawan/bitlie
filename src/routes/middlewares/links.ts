import { NextFunction, Request, Response } from "express";
import z from "zod";
import { HttpStatusCode } from "../../lib/http-status-code";

export function middlewareLinkRedirectRequestValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = z
    .object({
      nc: z.enum(["1", "0"]).default("0").optional(), // nc = No Click
    })
    .safeParse(req.query);

  if (!schema.success) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      code: HttpStatusCode.BAD_REQUEST,
      status: "error",
      message: "Bad Request",
      errors: [
        ...schema.error.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        })),
      ],
    });
    return;
  }

  next();
}

export function middlewareLinkGetRequestValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const inputSchema = z
    .object({
      sort_by: z
        .enum(["name", "alias", "url", "createdAt", "updatedAt"])
        .default("createdAt")
        .optional(),
      order: z.enum(["asc", "desc"]).default("asc").optional(),
      with_clicks: z.enum(["1", "0"]).default("0").optional(),
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

  next();
}

export function middlewareLinkCreateRequestValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = z
    .object({
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        })
        .min(1, "Name is required"),
      alias: z
        .string({
          required_error: "Alias is required",
          invalid_type_error: "Alias must be a string",
        })
        .min(1, "Alias is required")
        .regex(
          /^[a-zA-Z0-9-_]+$/,
          "Alias must be alphanumeric and hyphens and underscores only"
        ),
      url: z
        .string({
          required_error: "URL is required",
          invalid_type_error: "URL must be a string",
        })
        .regex(
          /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\d{2,5})?@)?(?:localhost|(?!localhost)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))))(?::\d{2,5})?(?:[/?#]\S*)?$/,
          "URL is invalid"
        ),
    })
    .safeParse(req.body);

  if (!schema.success) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      code: HttpStatusCode.BAD_REQUEST,
      status: "error",
      message: "Bad Request",
      errors: [
        ...schema.error.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        })),
      ],
    });
    return;
  }

  next();
}

export function middlewareLinkUpdateRequestValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = z
    .object({
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        })
        .min(1, "Name is required"),
      alias: z
        .string({
          required_error: "Alias is required",
          invalid_type_error: "Alias must be a string",
        })
        .min(1, "Alias is required")
        .regex(
          /^[a-zA-Z0-9-_]+$/,
          "Alias must be alphanumeric and hyphens and underscores only"
        ),
      url: z
        .string({
          required_error: "URL is required",
          invalid_type_error: "URL must be a string",
        })
        .regex(
          /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\d{2,5})?@)?(?:localhost|(?!localhost)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))))(?::\d{2,5})?(?:[/?#]\S*)?$/,
          "URL is invalid"
        ),
    })
    .safeParse(req.body);

  if (!schema.success) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      code: HttpStatusCode.BAD_REQUEST,
      status: "error",
      message: "Bad Request",
      errors: [
        ...schema.error.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        })),
      ],
    });
    return;
  }

  next();
}

export async function middlewareLinkDeleteRequestValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = z
    .object({
      id: z.string().min(1, "ID is required"),
    })
    .safeParse(req.params);

  if (!schema.success) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      code: HttpStatusCode.BAD_REQUEST,
      status: "error",
      message: "Bad Request",
      errors: [
        ...schema.error.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        })),
      ],
    });
    return;
  }

  next();
}
