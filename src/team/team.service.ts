import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TeamEntity } from './team.entity';
import { CreateTeamDto } from './team.createDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/user.entity';
import { UpdateTeamDto } from './team.updateDto';
import { successResponse, failureResponse } from 'src/common/response.helper';

@Injectable()
export class TeamService {

  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly userService: UserService
  ) { }

  async getAllTeams() {
    try {
      const teams = await this.teamRepository.find({
        where: { isActive: true },
        relations: ['createdBy', 'teamLead', 'members'],
      });
      return successResponse(teams, 'Teams fetched successfully');
    } catch (error) {
      return failureResponse('Failed to fetch teams', 500, error.message);
    }
  }

  async createTeam(teamDto: CreateTeamDto) {
    try {
      const team = this.teamRepository.create(
        teamDto);

      if (teamDto.createdById)
        team.createdBy = await this.userService.findUserById(teamDto.createdById);
      if (teamDto.teamLeadId)
        team.teamLead = await this.userService.findUserById(teamDto.teamLeadId);
      if (teamDto.membersIds)
        team.members = await this.userService.findUsersByIds(teamDto.membersIds);
      const saved = await this.teamRepository.save(team);
      return successResponse(saved.id, 'Team created successfully');
    } catch (error) {
      return failureResponse('Failed to create team', 400, error.message);
    }
  }

  async updateTeam(id: string, dto: UpdateTeamDto) {
    try {
      const existingTeam = await this.teamRepository.findOne({
        where: { id, isActive: true },
        relations: ['createdBy', 'teamLead', 'members'],
      });

      if (!existingTeam)
        throw new NotFoundException(`Team with ID ${id} not found`);


      const { teamName, description, createdById, teamLeadId, membersIds } = dto;

      if (teamName)
        existingTeam.teamName = teamName;
      if (description)
        existingTeam.description = description;
      if (createdById) {
        const createdBy = await this.userService.findUserById(createdById);
        existingTeam.createdBy = createdBy;
      }
      if (teamLeadId) {
        const teamLead = await this.userService.findUserById(teamLeadId);
        existingTeam.teamLead = teamLead;
      }
      if (membersIds && membersIds.length > 0) {
        const members = await this.userService.findUsersByIds(membersIds);
        existingTeam.members = members;
      }
      const updated = await this.teamRepository.save(existingTeam);
      return successResponse(updated.id, 'Team updated successfully');
    } catch (error) {
      return failureResponse('Failed to update team', 400, error.message);
    }
  }

  async deleteTeam(id: string): Promise<object> {
    try {
      const delteam = await this.teamRepository.findOne({
        where: { id, isActive: true },
      });
      if (!delteam)
        throw new NotFoundException(`Team with ID ${id} not found`);
      delteam.isActive = false;
      const saved = await this.teamRepository.save(delteam);
      return successResponse(saved.id, 'Team Deleted successfully');
    } catch (error) {
      return failureResponse('Failed to Delete team', 500, error.message);
    }
  }


  async addMember(teamId: string, userId: string) {
    try {
      const addteam = await this.teamRepository.findOne({
        where: { id: teamId, isActive: true },
        relations: ['members'],
      });

      if (!addteam)
        return failureResponse('Team not found', 404);

      const user = await this.userService.findUserById(userId);
      if (!user)
        return failureResponse('User not found', 404);

      const alreadyPresent = addteam.members?.some(m => m.id === user.id);
      if (alreadyPresent) {
        return failureResponse('User is already a member of this team', 400);
      }
      addteam.members?.push(user);
      const saved = await this.teamRepository.save(addteam);
      return successResponse(saved, 'Team Member added successfully');
    } catch (error) {
      return failureResponse('Failed to add member to the team', 500, error.message);
    }
  }



  async removeMember(teamId: string, userId: string) {
    try {
      const remteam = await this.teamRepository.findOne({
        where: { id: teamId, isActive: true },
        relations: ['members'],
      });
      if (!remteam)
        return failureResponse('Team not found', 404);

      const user = await this.userService.findUserById(userId);
      if (!user)
        return failureResponse('User not found', 404);
      const isMember = remteam.members?.some(m => m.id === user.id);
      if (!isMember) {
        return failureResponse('User is not a member of this team', 400);
      }
      remteam.members = remteam.members?.filter(m => m.id !== user.id);

      const updated = await this.teamRepository.save(remteam);
      return successResponse(updated, 'Team member removed successfully');
    } catch (error) {
      return failureResponse('Failed to remove team member', 400, error.message);
    }
  }

  async findTeamById(teamId: string): Promise<TeamEntity> {
    try {
      const teamById = await this.teamRepository.findOne({
        where: { id: teamId }, relations: ['members']
      });
      if (!teamById)
        throw new NotFoundException("team not found")
      return teamById;
    }
    catch (error) {
      throw new BadRequestException("Internal Error")
    }
  }

  async getUserTeamWithMembers(userId: string) {
    try {
      const userTeam = await this.teamRepository.findOne({
        where: { members: { id: userId } }
        
      });

      if (!userTeam) {
        return failureResponse('User Not Assigned in Any Team', 404,);
      }
      const team=await this.teamRepository.findOne({
        where: { id:userTeam.id },relations:['createdBy', 'teamLead', 'members']});
      return successResponse(team, 'user Team fetched successfully');
    } catch (error) {
      return failureResponse('Failed to fetch team', 500, error.message);
    }
  }


}
