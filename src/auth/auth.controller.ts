import { Controller, Inject, Post, Body } from '@nestjs/common';
import Redis from 'ioredis';

@Controller('auth')
export class AuthController {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  @Post('login')
  async login(@Body() body: any) {
    const userId = body.userId;

    console.log('User logged in:', userId);

    //rate limit implementation
    // Allow max 5 login attempts per minute per user
    const ratekey = `rate_limit:${userId}`;
    const count = await this.redis.incr(ratekey);

    if (count === 1) {
      await this.redis.expire(ratekey, 60);
    }

    if (count > 5) {
      return {
        message: 'Too many requests. Please try after some time',
      };
    }

    //session management implementation
    // Store session in Redis with a TTL(Time to live) of 60 seconds
    await this.redis.set(
      `session:${userId}`,
      JSON.stringify({ userId }),
      'EX',
      60,
    );

    return { message: 'Login successful', userId };
  }
}
