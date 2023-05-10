import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async create(payload: CreateUserDTO) {
    try {
      if (await this.usersService.findOne(payload.pseudo))
        throw new ForbiddenException('Pseudo already exists');
      payload.password = getReduceMd5(payload.password);
      return this.usersService.create(payload);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async validate(payload) {
    const user = await this.usersService.findOne(payload.pseudo);
    if (user && user.password === getReduceMd5(payload.password)) {
      return user;
    }
    throw new ForbiddenException('Invalid Informations');
  }

  getToken(payload) {
    return {
      access_token: this.jwtService.sign({
        pseudo: payload.pseudo,
        sub: payload.id,
      }),
    };
  }
}
/**
 *
 * @param input Input to hash
 * @returns MD5 of input, but reduced (save some room in database)
 */
function getReduceMd5(input) {
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 6);
}
