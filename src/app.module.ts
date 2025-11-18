import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { TeamModule } from './team/team.module';
import { TaskModule } from './task/task.module';
import { TaskEntity } from './task/task.entity';
import { TeamEntity } from './team/team.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminSeeder } from './user/user.admin.seeder';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    UserModule, TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        entities: [UserEntity, TeamEntity, TaskEntity],
        synchronize: true,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT!),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
      })
    }), TeamModule, TaskModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, AdminSeeder],
})
export class AppModule { }
