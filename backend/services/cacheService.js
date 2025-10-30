import { getRedisClient } from "../config/redis.js";
import { logger } from "../utils/logger.js";

class CacheService {
  constructor() {
    this.client = getRedisClient();
    this.defaultTTL = 3600; // 1 hour in seconds
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttl, serializedValue);
      logger.debug(`Cache set: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      if (value) {
        logger.debug(`Cache hit: ${key}`);
        return JSON.parse(value);
      }
      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async delete(key) {
    try {
      await this.client.del(key);
      logger.debug(`Cache deleted: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  async exists(key) {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async increment(key) {
    try {
      const result = await this.client.incr(key);
      return result;
    } catch (error) {
      logger.error(`Cache increment error for key ${key}:`, error);
      return null;
    }
  }

  async expire(key, ttl) {
    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }

  // Pattern-based operations
  async deletePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.debug(
          `Deleted ${keys.length} keys matching pattern: ${pattern}`
        );
      }
      return keys.length;
    } catch (error) {
      logger.error(`Cache delete pattern error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  // Cache management methods
  async flushAll() {
    try {
      await this.client.flushAll();
      logger.info("Cache flushed");
      return true;
    } catch (error) {
      logger.error("Cache flush error:", error);
      return false;
    }
  }

  async getStats() {
    try {
      const info = await this.client.info("memory");
      const keys = await this.client.keys("*");

      return {
        totalKeys: keys.length,
        memoryUsage: info,
        connected: true,
      };
    } catch (error) {
      logger.error("Cache stats error:", error);
      return {
        totalKeys: 0,
        memoryUsage: null,
        connected: false,
      };
    }
  }

  // Application-specific cache methods
  async cacheUserData(userId, data, ttl = 1800) {
    const key = `user:${userId}:data`;
    return this.set(key, data, ttl);
  }

  async getUserData(userId) {
    const key = `user:${userId}:data`;
    return this.get(key);
  }

  async cacheJobRecommendations(userId, recommendations, ttl = 3600) {
    const key = `user:${userId}:recommendations`;
    return this.set(key, recommendations, ttl);
  }

  async getJobRecommendations(userId) {
    const key = `user:${userId}:recommendations`;
    return this.get(key);
  }

  async cacheAnalytics(userId, period, analytics, ttl = 1800) {
    const key = `user:${userId}:analytics:${period}`;
    return this.set(key, analytics, ttl);
  }

  async getAnalytics(userId, period) {
    const key = `user:${userId}:analytics:${period}`;
    return this.get(key);
  }

  async invalidateUserCache(userId) {
    const pattern = `user:${userId}:*`;
    return this.deletePattern(pattern);
  }

  // Rate limiting
  async checkRateLimit(key, limit, windowInSeconds) {
    try {
      const current = await this.client.get(key);

      if (current === null) {
        await this.client.setEx(key, windowInSeconds, "1");
        return { allowed: true, remaining: limit - 1 };
      }

      const currentCount = parseInt(current);
      if (currentCount >= limit) {
        const ttl = await this.client.ttl(key);
        return { allowed: false, remaining: 0, retryAfter: ttl };
      }

      await this.client.incr(key);
      return { allowed: true, remaining: limit - currentCount - 1 };
    } catch (error) {
      logger.error(`Rate limit check error for key ${key}:`, error);
      // Fail open - allow the request if Redis is down
      return { allowed: true, remaining: limit - 1 };
    }
  }
}

export const cacheService = new CacheService();
export default cacheService;
