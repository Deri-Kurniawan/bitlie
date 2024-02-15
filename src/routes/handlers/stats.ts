import { Request, Response } from "express";
import { HttpStatusCode } from "../../lib/http-status-code";
import prisma from "../../lib/prisma";
import { getPackageJson } from "../../lib/utils";

export async function handleGetStats(_: Request, res: Response) {
  const links = await prisma?.link.findMany({
    select: {
      id: true,
      clicks: true,
    },
  });

  const packageJson = await getPackageJson();

  res
    .status(HttpStatusCode.OK)
    .setHeader("Content-Type", "application/json")
    .json({
      code: HttpStatusCode.OK,
      message: "Retrieved stats successfully!",
      data: {
        appVersion: packageJson.version,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        cpuUsageMb: process.cpuUsage(),
        memoryUsageMB: {
          rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
          heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2),
          heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
          external: (process.memoryUsage().external / 1024 / 1024).toFixed(2),
        },
        links: {
          total: links?.length || 0,
          clicks: links?.reduce((acc, link) => acc + link.clicks, 0) || 0,
        },
      },
    });
}
