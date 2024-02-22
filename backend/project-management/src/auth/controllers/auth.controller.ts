import { Controller, Post, Res, UseGuards, Request, Get } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { LogInDto } from '../dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * Log in a user.
   * @param req - The login request containing user credentials.
   * @param res - The response object to set the JWT cookie.
   * @returns The logged-in user's information (userId, email, and role).
   */
  @ApiCreatedResponse({
    type: LogInDto,
    schema: { $ref: getSchemaPath(LogInDto) },
    description: 'Successfully logs in user.',
  })
  @ApiNotFoundResponse({ description: 'User with email not found' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.login(req.user);
    res.cookie('jwt', jwt, { httpOnly: true });
    return req.user;
  }

  /**
   * Log out the currently logged-in user.
   * @param res - The response object to clear the JWT cookie.
   * @returns A message indicating successful user logout.
   */
  @ApiOkResponse({
    description: 'Successfully logs out current user.',
  })
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'User logged out.' };
  }
}
