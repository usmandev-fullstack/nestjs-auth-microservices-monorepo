import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../../common/core/dto/create-user.dto';
import { LoginDto } from '../../common/core/dto/login.dto';
import { ChangePasswordDto } from '../../common/core/dto/change-password.dto';
import { UserDto } from '../../common/core/dto/user.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ cmd: 'register' })
  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    return this.authenticationService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'get_users' })
  async getUsers(): Promise<UserDto[]> {
    return this.authenticationService.findAll();
  }

  @MessagePattern({ cmd: 'login' })
  async login(loginDto: LoginDto): Promise<UserDto> {
    return this.authenticationService.login(loginDto);
  }

  @MessagePattern({ cmd: 'change_password' })
  async changePassword(data: { userId: string; changePasswordDto: ChangePasswordDto }): Promise<void> {
    return this.authenticationService.changePassword(data.userId, data.changePasswordDto);
  }

  @MessagePattern({ cmd: 'get_profile' })
  async getProfile(userId: string): Promise<UserDto> {
    return this.authenticationService.getProfile(userId);
  }
}
