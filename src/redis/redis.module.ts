import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        const client = new Redis({
          host: 'localhost',
          port: 6379,
        });
        client.on('connect', () => console.log('✅ Redis connected'));
        client.on('error', (err) => console.error('❌ Redis error:', err));
        return client;
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
