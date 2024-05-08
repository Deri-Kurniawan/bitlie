import http from "http";
import app from "./app";

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, (): void => {
  console.log(`[server]: Server is running at http://[::1]:${port}`);
});
