import { Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../../../common/core/dto/create-user.dto';
import { LoginDto } from '../../../common/core/dto/login.dto';
import { ChangePasswordDto } from '../../../common/core/dto/change-password.dto';
import { UserDto } from '../../../common/core/dto/user.dto';
import { ErrorResponseDto } from '../../../common/core/dto/error-response.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided information.'
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration details',
    examples: {
      validUser: {
        summary: 'Valid User Registration',
        value: {
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'Password123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: UserDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Invalid input data',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be a valid email address',
          'firstName must be at least 2 characters long',
          'password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        ],
        error: 'Bad Request',
        timestamp: new Date().toISOString()
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Email already exists',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 409,
        message: ["A user with email 'john.doe@example.com' already exists"],
        error: 'Email Conflict',
        timestamp: new Date().toISOString()
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal Server Error',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 500,
        message: ['An error occurred while creating the user. Please try again later.'],
        error: 'Internal Server Error',
        timestamp: new Date().toISOString()
      }
    }
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.authService.register(createUserDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users retrieved successfully',
    type: [UserDto] 
  })
  async getUsers(): Promise<UserDto[]> {
    return this.authService.getUsers();
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    type: UserDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid credentials' 
  })
  async login(@Body() loginDto: LoginDto): Promise<UserDto> {
    return this.authService.login(loginDto);
  }

  @Put('users/:id/password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Password successfully changed' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Invalid password format' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Current password is incorrect' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Not Found - User not found' 
  })
  async changePassword(
    @Param('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Get('users/:id/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    type: UserDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Not Found - User not found' 
  })
  async getProfile(@Param('id') userId: string): Promise<UserDto> {
    return this.authService.getProfile(userId);
  }
}
