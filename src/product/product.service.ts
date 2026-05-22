import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ProductService {
  private readonly CACHE_KEY = 'cache:/products';

  constructor(private readonly redisService: RedisService) {}

  async findAll() {
    return {
      source: 'database',
      products: [
        { id: 1, name: 'Product A', price: 29.99 },
        { id: 2, name: 'Product B', price: 49.99 },
        { id: 3, name: 'Product C', price: 9.99 },
      ],
    };
  }

  async invalidateCache(): Promise<void> {
    await this.redisService.del(this.CACHE_KEY);
  }
}
