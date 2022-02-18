import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // LocalAuthGuard checks if username and password match and adds a ReadUserDto to the request
    // Login then basically only converts the user data into a JWT success token
    return this.authService.login(req.user);
  }
}
