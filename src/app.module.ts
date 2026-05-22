import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { AuthController } from './auth/auth.controller';
import { ProductController } from './product/product.controller';
import { ChatController } from './chat/chat.controller';
import { QueueController } from './queue/queue.controller';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [AuthModule, ChatModule, ProductModule, QueueModule, RedisModule],
  controllers: [
    AppController,
    AuthController,
    ProductController,
    QueueController,
    ChatController,
  ],
  providers: [AppService],
})
export class AppModule {}
