import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateUserDTO } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import * as safeEval from 'safe-eval';

class CustomError extends Error {
  constructor(msg) {
    super(msg);
  }

  // TODO: Print where our custom error is throw
  // from(cls) {
  //   return `Error from: ${cls.constructor.name}`;
  // }
}

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private readonly appService: AppService,
  ) {
    this.authService
      .create({
        pseudo: 'admin',
        password: process.env.SECRET || '',
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  @Post('auth/register')
  async register(@Body() payload: CreateUserDTO) {
    const user = await this.authService.create(payload);
    return this.authService.getToken(user);
  }

  @Post('auth/login')
  async login(@Body() payload) {
    const user = await this.authService.validate(payload);
    return this.authService.getToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('infos')
  getProfile(@Request() req) {
    return this.usersService.get(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('exec')
  executeCodeSafely(@Request() req, @Body('code') code: string) {
    if (req.user.pseudo === 'admin')
      try {
        const result = safeEval(code);
        if (!result) throw new CustomError('safeEval Failed');
        return { result };
      } catch (error) {
        return {
          from: error.from ? error.from(AppController) : 'Unknown error source',
          msg: error.message,
        };
      }
    return {
      result: "You're not admin !",
    };
  }
}
