import { IsEmail, IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'john.doe@example.com',
    description: 'User email address'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    example: 'John',
    description: 'User first name'
  })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @IsNotEmpty({ message: 'First name is required' })
  @Matches(/^[a-zA-Z]+$/, { message: 'First name can only contain letters' })
  firstName: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'User last name'
  })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Matches(/^[a-zA-Z]+$/, { message: 'Last name can only contain letters' })
  lastName: string;

  @ApiProperty({ 
    example: 'Password123!',
    description: 'User password - must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character' }
  )
  password: string;
}
