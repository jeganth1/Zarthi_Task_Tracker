// dto/create-task.dto.ts
import { IsNotEmpty, IsString, IsEnum, IsUUID, IsOptional, IsDateString } from 'class-validator';
import { TaskStatus } from '../task.status';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    enumName: 'TaskStatus',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedTo: string;   // user ID

  @ApiProperty()
  @IsUUID()
  teamId: string;

  @ApiProperty()
  @IsUUID()
  createdBy: string;
}
