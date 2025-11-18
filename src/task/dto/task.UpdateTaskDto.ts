import { IsOptional, IsString, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus } from '../task.status';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateTaskDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

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
  dueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiProperty()
  @IsUUID()
  updatedBy: string
}
