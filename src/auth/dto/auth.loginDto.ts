import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional()
  @IsString()
  username: string;
  
  @ApiPropertyOptional()
  @IsString()
  password: string;
}
