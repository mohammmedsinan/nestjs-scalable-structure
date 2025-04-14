import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from '@common/guards';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@client/users/dtos/create.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Request() req: any) {
    return this.authService.signup(req.body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
