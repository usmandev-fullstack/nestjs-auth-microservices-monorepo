import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NetworkingService } from '../../../common/core/networking.service';
import { CreateUserDto } from '../../../common/core/dto/create-user.dto';
import { LoginDto } from '../../../common/core/dto/login.dto';
import { ChangePasswordDto } from '../../../common/core/dto/change-password.dto';
import { UserDto } from '../../../common/core/dto/user.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly networkingService: NetworkingService) {}

  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    const response = await firstValueFrom(
      this.networkingService.getClient().send({ cmd: 'register' }, createUserDto)
    );

    // Check if response is an error object
    if (response?.statusCode && response?.error) {
      switch (response.statusCode) {
        case 409:
          throw new ConflictException(response);
        case 401:
          throw new UnauthorizedException(response);
        default:
          throw new InternalServerErrorException(response);
      }
    }

    return response;
  }

  async getUsers(): Promise<UserDto[]> {
    const response = await firstValueFrom(
      this.networkingService.getClient().send({ cmd: 'get_users' }, {})
    );
    return response;
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const response = await firstValueFrom(
      this.networkingService.getClient().send({ cmd: 'login' }, loginDto)
    );

    // Check if response is an error object
    if (response?.statusCode && response?.error) {
      switch (response.statusCode) {
        case 401:
          throw new UnauthorizedException(response);
        default:
          throw new InternalServerErrorException(response);
      }
    }

    return response;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const response = await firstValueFrom(
      this.networkingService.getClient().send(
        { cmd: 'change_password' },
        { userId, changePasswordDto }
      )
    );

    // Check if response is an error object
    if (response?.statusCode && response?.error) {
      switch (response.statusCode) {
        case 404:
          throw new NotFoundException(response);
        case 401:
          throw new UnauthorizedException(response);
        default:
          throw new InternalServerErrorException(response);
      }
    }

    return response;
  }

  async getProfile(userId: string): Promise<UserDto> {
    const response = await firstValueFrom(
      this.networkingService.getClient().send({ cmd: 'get_profile' }, userId)
    );
    return response;
  }
}
