export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL ?? '60', 10),
  },
  session: {
    ttl: parseInt(process.env.SESSION_TTL ?? '3600', 10),
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '5', 10),
    window: parseInt(process.env.RATE_LIMIT_WINDOW ?? '60', 10),
  },
});
