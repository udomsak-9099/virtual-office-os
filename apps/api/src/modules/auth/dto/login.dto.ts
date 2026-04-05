import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @MinLength(1)
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @MinLength(1)
  password: string;
}
