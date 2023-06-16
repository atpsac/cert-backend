import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import UsersRepository from './users.repository';
import UserAlreadyExistsException from './exceptions/userAlreadyExists.exception';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) { }

  async getById(id: number) {
    return this.usersRepository.getById(id);
  }

  async create(user: CreateUserDto) {
    try {
      return await this.usersRepository.create(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        this.logger.warn(error.message);
      }
      throw error;
    }
  }

  async findByUsernameWithRoles(username: string) {
    return this.usersRepository.getUserWithRoles(username);
  }

  async findByUsername(username: string) {
    return this.usersRepository.getByUsername(username);
  }

  async updateRefreshToken(userid: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateRefreshToken(userid, updateUserDto);
  }


}

export default UsersService;
