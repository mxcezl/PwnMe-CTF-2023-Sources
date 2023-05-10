import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>,
  ) {}

  async findOne(pseudo: string): Promise<UserEntity | undefined> {
    return this.repository.findOne({ where: { pseudo } });
  }

  async create(payload: CreateUserDTO) {
    if (payload.password != '' || payload.pseudo != '')
      return this.repository.save(payload);
    else throw new UnprocessableEntityException('Empty field');
  }

  async get(user: UserEntity) {
    try {
      // Custom query to rename pseudo into username
      const users = await this.repository.query(
        `SELECT users.pseudo as username, users.id FROM users WHERE users.id = '${user.id}'`,
      );
      return users[0];
    } catch (error) {
      throw new ForbiddenException('Unknow Error');
    }
  }
}
