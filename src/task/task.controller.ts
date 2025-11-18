
import { Controller, Post, Body, Param, Put, Delete, Get, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';

import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTaskDTO } from './dto/task.createDto';
import { UpdateStatusDTO } from './dto/task.updateTaskStatus';
import { UpdateTaskDTO } from './dto/task.UpdateTaskDto';
import { JwtAuthGuard } from 'src/auth/auth.jwt.guard';
import { Roles } from 'src/auth/auth.roles.decorator';
import { RolesGuard } from 'src/auth/auth.roles.guard';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
  ) { }

  @ApiOperation({ summary: 'create a new task', description: 'This endpoint is used to create a new task by the team member' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(@Body() dto: CreateTaskDTO) {
    return this.taskService.createTask(dto);
  }

  @ApiTags('Admin')
  @ApiOperation({ summary: 'get all the task of the Team', description: 'This endpoint is used to get all the tasks of the team and only accessable to the admin' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('team/:teamId')
  getTeamTasks(@Param('teamId') teamId: string) {
    return this.taskService.getTeamTasks(teamId);
  }

  @ApiOperation({ summary: 'Update the status of the Task', description: 'This endpoint is used to update the task status' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDTO) {
    return this.taskService.updateTaskStatus(id, dto);
  }


  @ApiOperation({ summary: 'Delete the Task', description: 'This endpoint is used to delete the task and accessable only to the admin' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }


  @ApiOperation({ summary: 'Update the Task', description: 'This endpoint is used to Update the task' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  async updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDTO
  ) {
    return this.taskService.updateTask(id, dto);
  }

  @ApiOperation({ summary: 'Get all the task of the user team members', description: 'This endpoint is used to get all the task the users team member' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('team/:userId/tasks')
  async getTasksOfUserTeam(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.taskService.getTasksOfUserTeam(userId);
  }

}
