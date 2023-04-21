import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import UsersRepository from './users.repository';
import UserAlreadyExistsException from './exceptions/userAlreadyExists.exception';

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

  async findByUsername(username: string): Promise < UserModel > {

    const user = await this.userRepository.findOne(
      {
        relations: {
          roles: true
        },
        where: { username },
        select: {
          id: true,
          username: true,
          password: true,
          isActive: true,
        }
      });
  
    if(!user)
      throw new NotFoundException(`Username is not found`);
  
    return user;
  }

}

export default UsersService;
