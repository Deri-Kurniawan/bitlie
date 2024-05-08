import consola from "consola";
import http from "http";
import app from "./app";

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, (): void => {
  consola.info(`[server]: Server is running at http://[::1]:${port}`);
});
