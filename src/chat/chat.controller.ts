import { Body, Controller, MessageEvent, Post, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post('send')
  async sendMessage(
    @Body() dto: SendMessageDto,
    @CurrentUser() user: { userId: string },
  ) {
    await this.chatService.sendMessage(dto, user.userId);
    return { message: 'Published to chat channel', by: user.userId };
  }

  @Public()
  @Sse('subscribe')
  subscribe(): Observable<MessageEvent> {
    return this.chatService.createMessageStream();
  }
}
