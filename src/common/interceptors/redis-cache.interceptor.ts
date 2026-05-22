import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../../redis/redis.service';

//Interceptor that caches HTTP GET responses in Redis.
@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const cacheKey = `cache:${request.url}`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return of({ ...(JSON.parse(cached) as object), source: 'redis-cache' });
    }

    const ttl = this.configService.get<number>('cache.ttl') ?? 60;

    return next.handle().pipe(
      tap(async (data) => {
        await this.redisService.set(cacheKey, JSON.stringify(data), ttl);
      }),
    );
  }
}
