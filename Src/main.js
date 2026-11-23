import express from "express";
import cors from "cors";
import envConfig from "./config/env.config.js";
import { coreOptions } from "./config/cors.config.js";
import dbConnection from "./DB/db.connection.js";
import globalErrorHandler from "./middlewares/globelErrorHandler.js";
import * as controllers from "./modules/index.js";
import { redisConnection } from "./Common/Clients/redis.client.js";

const app = express();
const port = envConfig.app.PORT;

app.use(cors(coreOptions));
app.use(express.json());

dbConnection();
await redisConnection();
app.use("/api/auth", controllers.authController);
app.use("/user", controllers.userController);
app.use("/message", controllers.messageController);

app.get("/", (req, res, next) => {
  res.status(200).json("Saraha App is running");
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Router not found" });
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
