import {
  Controller,
  Inject,
  Post,
  Body,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import Redis from 'ioredis';
import { Observable } from 'rxjs';

@Controller('chat')
export class ChatController {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}
// Publish/Subscribe implementation`
  @Post('send')
  // Send message to Redis channel
  async sendMessage(@Body() body: any) {
    await this.redis.publish('chatChannel', JSON.stringify(body));

    return { message: 'Message sent to chat channel' };
  }
// Subscribe to Redis channel and stream messages to clients using Server-Sent Events (SSE)
  @Sse('subscribe')
  subscribe(): Observable<MessageEvent> {
    const subscriber = new Redis({ host: 'localhost', port: 6379 });

    return new Observable((observer) => {
      subscriber.subscribe('chatChannel', (err) => {
        if (err) observer.error(err);
      });

      subscriber.on('message', (channel, message) => {
        observer.next({ data: JSON.parse(message) });
      });

      // cleanup when client disconnects
      return () => {
        subscriber.unsubscribe('chatChannel');
        subscriber.quit();
      };
    });
  }
}
