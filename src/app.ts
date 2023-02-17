import http from "http";
import express from "express";
import { initExpress } from "./config/express";
import { initSocketIO } from "./config/socket";
import { initDb } from "./config/mongoose";
import logger from "./config/logger";
import swaggerConfig from "./config/swagger";

const app = express();
initExpress(app);

const server = http.createServer(app);
const io = initSocketIO(server);

const PORT = process.env.PORT || 3000;

(async function () {
  await initDb();
  swaggerConfig(app);
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})();
