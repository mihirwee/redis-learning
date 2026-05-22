import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    dto: LoginDto,
  ): Promise<{ sessionToken: string; userId: string }> {
    await this.enforceRateLimit(dto.userId);

    const sessionToken = dto.userId;
    const sessionTtl = this.configService.get<number>('session.ttl') ?? 30;

    await this.redisService.set(
      `session:${sessionToken}`,
      JSON.stringify({ userId: dto.userId }),
      sessionTtl,
    );

    return { sessionToken, userId: dto.userId };
  }

  async logout(userId: string): Promise<void> {
    await this.redisService.del(`session:${userId}`);
  }

  private async enforceRateLimit(userId: string): Promise<void> {
    const max = this.configService.get<number>('rateLimit.max') ?? 5;
    const window = this.configService.get<number>('rateLimit.window') ?? 60;

    const rateKey = `rate_limit:${userId}`;
    const count = await this.redisService.incr(rateKey);

    if (count === 1) {
      // Set expiry only on the first increment so the window is fixed
      await this.redisService.expire(rateKey, window);
    }

    if (count > max) {
      throw new HttpException(
        'Too many login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
