import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly redisService: RedisService) {}
  async sendMessage(dto: SendMessageDto, userId: string): Promise<void> {
    const payload = {
      from: userId,
      message: dto.message,
      timestamp: new Date().toISOString(),
    };
    await this.redisService.publish('chatChannel', JSON.stringify(payload));
  }
  
  createMessageStream(): Observable<MessageEvent> {
    const subscriber = this.redisService.createSubscriberClient();

    return new Observable<MessageEvent>((observer) => {
      subscriber.subscribe('chatChannel', (err) => {
        if (err) observer.error(err);
      });

      subscriber.on('message', (_channel: string, raw: string) => {
        observer.next({ data: JSON.parse(raw) } as MessageEvent);
      });

      // Cleanup when the client disconnects
      return () => {
        subscriber.unsubscribe('chatChannel');
        subscriber.quit();
      };
    });
  }
}
