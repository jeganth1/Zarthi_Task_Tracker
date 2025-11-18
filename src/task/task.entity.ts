
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from './task.status';
import { UserEntity } from 'src/user/user.entity';
import { TeamEntity } from 'src/team/team.entity';


@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: false })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;


  @ManyToOne(() => UserEntity, { nullable: true })
  assignedTo?: UserEntity;

  @ManyToOne(() => TeamEntity, { nullable: false })
  team: TeamEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  createdBy: UserEntity

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
