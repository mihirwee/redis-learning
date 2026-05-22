import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Controller('products')
export class ProductController {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  @Get()
  async getProducts() {
    const caching = await this.redis.get('products');

    if (caching) {
      const ttl = await this.redis.ttl('products');
      return { ...JSON.parse(caching), cachedTimeLeftSeconds: ttl };
    }

    const products = [
      { id: 1, name: 'Product 5' },
      { id: 2, name: 'Product 10' },
      { id: 3, name: 'Product 13' },
    ];

    await this.redis.set('products', JSON.stringify(products), 'EX', 60);

    const return1 = { message: 'Products fetched from database', products };
    return return1;
  }
}
