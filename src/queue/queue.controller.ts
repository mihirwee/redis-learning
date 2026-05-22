import { Controller, Post, Body, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Controller('queue')
export class QueueController {
  constructor(@Inject('REDIS') private redis: Redis) {}

  @Post('email')
  async sendEmail(@Body() body: any) {
    await this.redis.lpush('emailQueue', JSON.stringify(body));

    return { message: 'Job added to queue' };
  }
}
