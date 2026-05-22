import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class EmailProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailProcessor.name);
  private isRunning = false;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit(): void {
    this.isRunning = true;
    this.startProcessing();
    this.logger.log('📬 Email processor started');
  }

  onModuleDestroy(): void {
    this.isRunning = false;
    this.logger.log('📪 Email processor stopped');
  }

  private async startProcessing(): Promise<void> {
    while (this.isRunning) {
      try {
        const raw = await this.redisService.rpop('emailQueue');
        if (raw) {
          await this.processEmail(JSON.parse(raw));
        }
      } catch (err) {
        this.logger.error('Failed to process email job', err);
      }

      // Yield the event loop for 1 s before polling again
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    }
  }

  private async processEmail(job: {
    to: string;
    subject: string;
    body: string;
    enqueuedAt: string;
  }): Promise<void> {
    this.logger.log(
      `✉️  Sending email → to: ${job.to} | subject: ${job.subject}`,
    );

    // Simulate async email delivery (e.g. SMTP / SendGrid call)
    await new Promise<void>((resolve) => setTimeout(resolve, 200));

    this.logger.log(`✅ Email delivered to: ${job.to}`);
  }
}
