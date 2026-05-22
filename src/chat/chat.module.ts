import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [ChatController],
})
export class ChatModule {}
