import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/userDto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateUserPassword(user: User, password: string) {
    try {
      const newPassword = await bcrypt.hash(password, 10);
      const result = await this.userRepository
        .createQueryBuilder()
        .update()
        .set({ password: newPassword })
        .where({ id: user.id })
        .execute();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll(page: number, limit: number) {
    return await this.userRepository.find({
      skip: (page - 1) * limit || 0,
      take: limit,
    });
  }

  async findAndGetTopics(id: number) {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['topics'],
      select: ['topics', 'id'],
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'username', 'password', 'email', 'name', 'picture'],
    });
  }

  async getUserInfo(email: string) {
    try {
      const user = await this.findOneByEmail(email);
      if (user) {
        throw new BadRequestException('Email already exist');
      }
      const splitEmail = email.split('@');
      const randomString = Math.random().toString(36).substring(2);
      const createUserBody = {
        username: splitEmail[0] + randomString,
        password: Math.random().toString(36).substring(2),
        email,
        name: splitEmail[0],
      };
      return createUserBody;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async registerUser(userBody: CreateUserDto) {
    try {
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(userBody)
        .execute();
      return userBody;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    try {
      await this.userRepository
        .createQueryBuilder()
        .update()
        .set(updateUser)
        .where({ id: id })
        .execute();
      return 'user updated';
    } catch (error) {
      return error.detail;
    }
  }

  deleteUser(id: number) {
    try {
      this.userRepository
        .createQueryBuilder()
        .delete()
        .where({ id: id })
        .execute();
      return 'user deleted';
    } catch (error) {
      return error.detail;
    }
  }

  deleteUserByEmail(email: string) {
    try {
      this.userRepository.createQueryBuilder().delete().where({ email: email })
        .execute;
      return 'user deleted';
    } catch (error) {
      return error.detail;
    }
  }
}
