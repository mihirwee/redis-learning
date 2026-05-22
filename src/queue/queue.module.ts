import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { EmailProcessor } from './email.processor';

@Module({
  controllers: [QueueController],
  providers: [QueueService, EmailProcessor],
})
export class QueueModule {}
