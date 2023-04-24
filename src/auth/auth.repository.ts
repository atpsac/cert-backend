
import { Injectable } from '@nestjs/common';
import DatabaseService from '../database/database.service';
import { plainToInstance } from 'class-transformer';
import UserModel from '../users/user.model';
import { CreateUserDto } from './dto';
import { isDatabaseError } from '../types/databaseError';

@Injectable()
class UsersRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    // async getAll() {
    //     const databaseResponse = await this.databaseService.runQuery(`
    //   SELECT * FROM users
    // `);
    //     return plainToInstance(UserModel, databaseResponse.rows);
    // }

    // async create(userData: CreateUserDto) {

    //     try {
    //         const databaseResponse = await this.databaseService.runQuery(
    //             `
    //   INSERT INTO users (
    //     username,
    //     password
    //   ) VALUES (
    //     $1,
    //     $2
    //   ) RETURNING *
    // `,
    //             [userData.username, userData.password],
    //         );
    //         return new UserModel(databaseResponse.rows[0]);
    //     } catch (error) {
    //         if (
    //             isDatabaseError(error) &&
    //             error.code === PostgresErrorCode.UniqueViolation
    //         ) {
    //             throw new UserAlreadyExistsException(userData.email);
    //         }
    //         throw error;
    //     }
    // }


}

export default UsersRepository;