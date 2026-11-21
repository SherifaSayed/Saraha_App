import { createClient } from "redis";
import { redisConfig } from "../../config/index.js";
export const redisClient = createClient(redisConfig);
redisClient.on("error", (err) => console.error(err));
redisClient.on("connect", () => console.log("redis connected"));

export const redisConnection = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("redis connection failed", error);
  }
};
