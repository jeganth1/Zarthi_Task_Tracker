// dto/update-status.dto.ts
import { IsEnum, IsUUID } from "class-validator";
import { TaskStatus } from "../task.status";
import { ApiProperty } from "@nestjs/swagger";


export class UpdateStatusDTO {
  @ApiProperty({
    enum: TaskStatus,
    enumName: 'TaskStatus',
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty()
  @IsUUID()
  updatedBy: string

}
