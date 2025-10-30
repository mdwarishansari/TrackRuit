import redis from 'redis';
import { logger } from '../utils/logger.js';

let client;

export const connectRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) => {
      logger.error("Redis Client Error:", err);
    });

    client.on("connect", () => {
      logger.info("Redis connected successfully");
    });

    await client.connect();
    return client;
  } catch (error) {
    logger.error("Redis connection error:", error);
    throw error;
  }
};

export const getRedisClient = () => {
  if (!client) {
    throw new Error("Redis client not initialized");
  }
  return client;
};

export const disconnectRedis = async () => {
  if (client) {
    await client.quit();
    logger.info("Redis disconnected");
  }
};