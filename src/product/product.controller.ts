import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { RedisCacheInterceptor } from '../common/interceptors/redis-cache.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseInterceptors(RedisCacheInterceptor)
  async getProducts(@CurrentUser() user: { userId: string }) {
    console.log(`Products requested by: ${user.userId}`);
    return this.productService.findAll();
  }
  
  @Delete('cache')
  @HttpCode(HttpStatus.OK)
  async clearCache() {
    await this.productService.invalidateCache();
    return { message: 'Product cache invalidated' };
  }
}
