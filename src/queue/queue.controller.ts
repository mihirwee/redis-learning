import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QueueService } from './queue.service';
import { EmailJobDto } from './dto/email-job.dto';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('email')
  @HttpCode(HttpStatus.ACCEPTED)
  async enqueueEmail(@Body() dto: EmailJobDto) {
    await this.queueService.enqueueEmail(dto);
    return { message: 'Email job accepted and queued for processing' };
  }
}
