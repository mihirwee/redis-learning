import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { EmailJobDto } from './dto/email-job.dto';

@Injectable()
export class QueueService {
  constructor(private readonly redisService: RedisService) {}

  async enqueueEmail(dto: EmailJobDto): Promise<void> {
    const job = JSON.stringify({
      ...dto,
      enqueuedAt: new Date().toISOString(),
    });
    await this.redisService.lpush('emailQueue', job);
  }
}
