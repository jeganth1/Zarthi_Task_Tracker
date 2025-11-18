import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './team.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity, UserEntity]),
    UserModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService]

})
export class TeamModule { }
