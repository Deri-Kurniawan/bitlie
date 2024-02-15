import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import path from "path";
import { routes } from "./routes/root";
import { Route } from "./types/globals";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

// Routes
routes.forEach((route: Route) => {
  const { path, method, middleware = [], handler } = route;
  app[method](path, ...middleware, handler);
});

server.listen(port, (): void => {
  console.log(`[server]: Server is running at http://[::1]:${port}`);
});

export default app;
