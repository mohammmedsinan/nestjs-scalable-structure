import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard, JwtAuthGuard, LocalAuthGuard } from '@common/guards';
import { AuthService } from './auth.service';
import type { ValidateUserResponse } from './types/auth.type';
// import { CreateUserDto } from '@client/users/dtos/create.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Request() req: any) {
    return this.authService.signup(req.body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request: { user: ValidateUserResponse }) {
    return await this.authService.login(request.user);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  async google() {
    // Google Auth Guard is handling the request
    return true;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res) {
    await res.json(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
