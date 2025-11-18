import { Controller, Get, Put, Param, ParseUUIDPipe, Body, Delete, Post, UseGuards } from "@nestjs/common";
import { TeamService } from "./team.service";
import { UpdateTeamDto } from "./team.updateDto";
import { CreateTeamDto } from "./team.createDto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/auth.jwt.guard";
import { Roles } from "src/auth/auth.roles.decorator";
import { RolesGuard } from "src/auth/auth.roles.guard";

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @ApiTags('Admin')
  @ApiOperation({ summary: 'To create a new Team', description: 'This endpoint is used to create a new team and accessable to admin' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createTeam(@Body() dto: CreateTeamDto) {
    return this.teamService.createTeam(dto);
  }

  @ApiTags('Admin')
  @ApiOperation({ summary: 'To get all the Teams', description: 'This endpoint is used to get all the Teams and accessable to admin' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getAllTeams() {
    return this.teamService.getAllTeams();
  }

  @ApiTags('Admin')
  @ApiOperation({ summary: 'To update the Team', description: 'This endpoint is used to update the team and accessable to admin' })
  @ApiBearerAuth()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async updateTeam(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeamDto
  ) {
    return this.teamService.updateTeam(id, dto);
  }

  @ApiTags('Admin')
  @ApiOperation({ summary: 'To delete the Team', description: 'This endpoint is used to delete the team and accessable to admin' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteTeam(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.deleteTeam(id);
  }

  @ApiTags('Admin')
  @ApiOperation({ summary: 'To add members to the Team', description: 'This endpoint is used to add members to the team and accessable to admin' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':teamId/members/:userId')
  addMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.teamService.addMember(teamId, userId);
  }

  @ApiTags('Admin')
  @ApiOperation({ summary: 'To remove members from the Team', description: 'This endpoint is used to remove members from the team and accessable to admin' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':teamId/members/:userId')
  removeMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.teamService.removeMember(teamId, userId);
  }

  @ApiOperation({ summary: 'To get users team and its members', description: 'This endpoint is used to get the user team and its members' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId/team')
  @UseGuards(JwtAuthGuard)
  async getMyTeam(@Param('userId',ParseUUIDPipe) userId: string) {
    return this.teamService.getUserTeamWithMembers(userId);
  }

}