import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../../common/core/dto/create-user.dto';
import { LoginDto } from '../../common/core/dto/login.dto';
import { ChangePasswordDto } from '../../common/core/dto/change-password.dto';
import { UserDto } from '../../common/core/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { MongoError } from 'mongodb';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto | any> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
      if (existingUser) {
        return {
          statusCode: 409,
          message: [`A user with email '${createUserDto.email}' already exists`],
          error: 'Email Conflict'
        };
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const user = await createdUser.save();
      return this.toUserDto(user);
    } catch (error) {
      if (error instanceof MongoError && error.code === 11000) {
        return {
          statusCode: 409,
          message: [`A user with email '${createUserDto.email}' already exists`],
          error: 'Email Conflict'
        };
      }
      return {
        statusCode: 500,
        message: ['An error occurred while creating the user. Please try again later.'],
        error: 'Internal Server Error'
      };
    }
  }

  async findAll(): Promise<UserDto[]> {
    try {
      const users = await this.userModel.find().exec();
      return users.map(user => this.toUserDto(user));
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async login(loginDto: LoginDto): Promise<UserDto | any> {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email }).exec();
      if (!user) {
        return {
          statusCode: 401,
          message: ['Invalid email or password'],
          error: 'Unauthorized'
        };
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        return {
          statusCode: 401,
          message: ['Invalid email or password'],
          error: 'Unauthorized'
        };
      }

      return this.toUserDto(user);
    } catch (error) {
      return {
        statusCode: 500,
        message: ['An error occurred during login. Please try again later.'],
        error: 'Internal Server Error'
      };
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<any> {
    try {
      const user = await this.userModel.findById(userId).exec();
    
      if (!user) {
        return {
          statusCode: 404,
          message: ['User not found'],
          error: 'Not Found'
        };
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return {
          statusCode: 401,
          message: ['Current password is incorrect'],
          error: 'Unauthorized'
        };
      }

      const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
      await this.userModel.findByIdAndUpdate(userId, {
        password: hashedNewPassword
      }).exec();

      return {
        statusCode: 200,
        message: ['Password changed successfully']
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: ['An error occurred while changing the password. Please try again later.'],
        error: 'Internal Server Error'
      };
    }
  }

  async getProfile(userId: string): Promise<UserDto> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.toUserDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching user profile');
    }
  }

  private toUserDto(user: UserDocument): UserDto {
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
