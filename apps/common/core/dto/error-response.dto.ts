import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code'
  })
  statusCode: number;

  @ApiProperty({
    example: ['Email already exists'],
    description: 'Error message(s)'
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error type'
  })
  error: string;

  @ApiProperty({
    example: '2024-01-20T12:00:00.000Z',
    description: 'Timestamp of the error'
  })
  timestamp: string;
} 