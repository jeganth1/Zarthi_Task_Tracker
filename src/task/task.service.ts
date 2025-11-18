
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamService } from '../team/team.service';
import { UserService } from 'src/user/user.service';
import { CreateTaskDTO } from './dto/task.createDto';
import { TaskEntity } from './task.entity';
import { UserEntity } from 'src/user/user.entity';
import { TeamEntity } from 'src/team/team.entity';
import { UpdateStatusDTO } from './dto/task.updateTaskStatus';
import { UpdateTaskDTO } from './dto/task.UpdateTaskDto';
import { failureResponse, successResponse } from 'src/common/response.helper';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepo: Repository<TaskEntity>,
    private userService: UserService,
    private teamService: TeamService,
  ) { }

  async createTask(dto: CreateTaskDTO) {
    try {
      const user: UserEntity | undefined = dto.assignedTo ? await this.userService.findUserById(dto.assignedTo) : undefined;
      if (!user && dto.assignedTo)
        return failureResponse('Invalid user for Asignee', 400);
      const team: TeamEntity = await this.teamService.findTeamById(dto.teamId);
      if (!team)
        return failureResponse('Invalid  team ID', 400);
      const createdUser: UserEntity = await this.userService.findUserById(dto.createdBy);
      if (!createdUser)
        return failureResponse('Invalid user to create the task', 400);
      const isCreatorInTeam = team.members?.some(m => m.id === createdUser.id);

      if (!isCreatorInTeam)
        throw new ForbiddenException(
          'Task creator must be a member of the team'
        );
      const isAssigneeCreator = user?.id === createdUser.id;
      const isAssigneeInTeam = team.members?.some(m => m.id === user?.id);

      if (!isAssigneeCreator && !isAssigneeInTeam && dto.assignedTo)
        throw new ForbiddenException(
          'Assigned user must be the creator or a member of the team'
        );

      const task = this.taskRepo.create({
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate,
        status: dto.status,
        assignedTo: user,
        createdBy: createdUser,
        team: team,
      });

      const taskAdded = await this.taskRepo.save(task);
      return successResponse(taskAdded.id, 'Task Added Sucessfully', 201)
    } catch (error) {
      return failureResponse('Failed to create task', 500, error.message);
    }
  }


  async getTeamTasks(teamId: string) {
    try {
      const tasks = await this.taskRepo.find({
        where: { team: { id: teamId } }, relations: ['createdBy', 'team', 'assignedTo']
      });
      return successResponse(tasks, 'Tasks fetched Sucessfully', 200)
    }
    catch (error) {
      return failureResponse('Failed to get Team task', 500, error.message);
    }
  }

  async updateTaskStatus(taskId: string, dto: UpdateStatusDTO) {
    try {
      const task = await this.taskRepo.findOne({ where: { id: taskId }, relations: ['assignedTo', 'team', 'createdBy'] });

      if (!task) throw new NotFoundException('Task not found');

      if (task.assignedTo?.id !== dto.updatedBy && task.createdBy.id !== dto.updatedBy) {
        throw new ForbiddenException('Only Assignee or Task owner can update the task status');
      }

      task.status = dto.status;

      const updated = await this.taskRepo.save(task);
      return successResponse(updated.id, 'Tasks status updated Sucessfully', 200)

    }
    catch (error) {
      return failureResponse('Failed to update task status', 500, error.message);
    }
  }

  async deleteTask(taskId: string) {
    try {
      const task = await this.taskRepo.findOne({ where: { id: taskId } });
      if (!task) throw new NotFoundException('Task not found');

      const deleted = await this.taskRepo.delete(taskId);

      return successResponse(deleted, 'Tasks deleted Sucessfully', 200)
    }
    catch (error) {
      return failureResponse('Failed to delete task', 500, error.message);
    }
  }

  async updateTask(id: string, dto: UpdateTaskDTO) {
    try {
      const task = await this.taskRepo.findOne({
        where: { id },
        relations: ['assignedTo', 'team', 'createdBy'],
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      const iscreator = task.createdBy.id === dto.updatedBy
      const isassigned = task.assignedTo?.id === dto.updatedBy

      if (!iscreator && !isassigned)
        throw new ForbiddenException(
          'task can be updated by the owner or assignee'
        );

      const user: UserEntity | undefined = dto.assignedTo ? await this.userService.findUserById(dto.assignedTo) : undefined;
      if (!user && dto.assignedTo)
        return failureResponse('Invalid user for Asignee', 400);


      const isAssigneeInTeam = task.team.members?.some(m => m.id === user?.id);

      if (!isAssigneeInTeam && dto.assignedTo)
        return failureResponse('Assignee    must be a member of the team', 400);

      if (dto.title) task.title = dto.title;
      if (dto.description) task.description = dto.description;
      if (dto.status) task.status = dto.status;
      if (dto.dueDate) task.dueDate = new Date(dto.dueDate);

      if (dto.assignedTo) {
        const user = await this.userService.findUserById(dto.assignedTo);
        task.assignedTo = user;
      }

      if (dto.teamId) {
        const team = await this.teamService.findTeamById(dto.teamId);
        task.team = team;
      }

      const updatedTask = await this.taskRepo.save(task);
      return successResponse(updatedTask.id, 'Tasks Updated Sucessfully', 200)
    }
    catch (error) {
      return failureResponse('Failed to get Team task', 500, error.message);
    }
  }


  async getTasksOfUserTeam(userId: string) {
    try {
      const user = await this.userService.findUserById(userId);

      if (!user) {
        return failureResponse('User not found', 404);
      }
      if (!user.team) {
        return failureResponse('User does not belong to any team', 404);
      }
      const teamId = user.team.id;
      const teamTasks = await this.taskRepo.find({
        where: { team: { id: teamId } },
        relations: ['assignedTo', 'createdBy', 'team'],
      });
      return successResponse(teamTasks, 'User team Task Fetched Successfully', 200)

    } catch (error) {
      return failureResponse('Failed to get task of the users team', 500, error.message);
    }

  }


}
