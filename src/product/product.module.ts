import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { RedisCacheInterceptor } from '../common/interceptors/redis-cache.interceptor';

@Module({
  controllers: [ProductController],
  providers: [ProductService, RedisCacheInterceptor],
})
export class ProductModule {}
