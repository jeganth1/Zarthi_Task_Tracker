import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { UserModule } from 'src/user/user.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeOrmModule.forFeature([TaskEntity]), UserModule, TeamModule]
})
export class TaskModule { }
