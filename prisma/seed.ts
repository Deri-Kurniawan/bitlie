import { Link } from "@prisma/client";

const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

(async () => {
  dotenv.config();

  console.log("Seed file for Prisma ORM");

  const prisma = new PrismaClient();

  //   clear all data
  // await prisma.link.deleteMany({});
  // await prisma.token.deleteMany({});
  // await prisma.click.deleteMany({});
  // console.log("All data cleared");

  const token = process.env.SEED_SECRET_TOKEN;

  if (token && token.length > 0) {
    console.log("Seeding token based on .env file");
    const findToken = await prisma.token.findFirst({
      where: {
        token,
      },
    });

    if (!findToken) {
      console.log("Token not found, seeding...");
      await prisma.token.create({
        data: {
          token,
          note: "Main token for the application to access the API",
        },
      });
    }

    console.log("Seeding token finished");
  } else {
    console.log("Token not found in .env file");
    console.log("Please add SEED_SECRET_TOKEN in .env file to seed token data");
    console.log("Skipping token seeding...");
  }

  const rawData = [
    {
      name: "GitHub",
      alias: "github",
      url: "https://github.com/deri-kurniawan",
    },
    {
      name: "Instagram",
      alias: "instagram",
      url: "https://instagram.com/deri561/",
    },
    {
      name: "Stackoverflow",
      alias: "stackoverflow",
      url: "https://stackoverflow.com/users/19716588/deri-kurniawan",
    },
    {
      name: "Linkedin",
      alias: "linkedin",
      url: "https://linkedin.com/in/deri-kurniawan/",
    },
    {
      name: "DevTo",
      alias: "devto",
      url: "https://dev.to/deri_kurniawan",
    },
    {
      name: "Uiverse",
      alias: "uiverse",
      url: "https://uiverse.io/profile/Deri-Kurniawan",
    },
    {
      name: "Dribbble",
      alias: "dribbble",
      url: "https://dribbble.com/deri-kurniawan",
    },
    {
      name: "Buymeacoffee",
      alias: "buymeacoffee",
      url: "https://www.buymeacoffee.com/derikurniawan",
    },
    {
      name: "Ko-fi",
      alias: "ko-fi",
      url: "https://ko-fi.com/derikurniawan",
    },
    {
      name: "Portfolio",
      alias: "portfolio",
      url: "https://deri.my.id/",
    },
    {
      name: "v0 by Vercel",
      alias: "v0",
      url: "https://v0.dev/deri-kurniawan",
    },
  ];

  const findMany = await prisma.link.findMany({
    where: {
      OR: rawData.map((item) => ({
        alias: item.alias,
      })),
    },
  });

  if (findMany.length > 0) {
    const existingAliases = findMany.map((item: Link) => item.alias);
    console.log(
      `Data already exists for aliases: ${existingAliases.join(", ")}`
    );
    console.log("Seed file for Prisma ORM finished");
    return;
  }

  console.log(`${rawData.length} Data not found, seeding...`);

  await prisma.link.createMany({
    data: rawData,
  });

  console.log("Seed file for Prisma ORM finished");
})();
