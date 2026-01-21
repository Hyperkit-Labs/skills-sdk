import Redis from 'ioredis';
import { Cache } from './Cache';

export class RedisCache implements Cache {
    private redis: Redis;

    constructor(connectionString?: string) {
        // Default to localhost, or use env var, or provided string
        const url = connectionString || process.env.REDIS_URL || 'redis://localhost:6379';
        this.redis = new Redis(url, {
            lazyConnect: true,
            enableOfflineQueue: false, // Fail fast if no connection so we fallback to non-cached
            retryStrategy: (times) => {
                // Simple retry: 50ms, 100ms, 150ms... max 2s
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        // Prevent unhandled error events from crashing the process if Redis is down
        this.redis.on('error', (_err) => {
            // console.warn('Redis connection error (suppressed):', _err.message);
        });
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.redis.get(key);
        } catch (error) {
            // Graceful degradation
            return null;
        }
    }

    async set(key: string, value: string, ttl: number = 3600): Promise<void> {
        try {
            await this.redis.set(key, value, 'EX', ttl);
        } catch (error) {
            // Graceful degradation
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.redis.quit();
        } catch (error) {
            // Force disconnect if quit fails
            this.redis.disconnect();
        }
    }
}
