import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { message: 'Login successful', ...result };
  }
  
  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: { userId: string }) {
    await this.authService.logout(user.userId);
    return { message: 'Logged out successfully' };
  }
}
