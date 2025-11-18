import { UserEntity } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class TeamEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  teamName: string;

  @Column({ nullable: true, type: 'text', })
  description?: string;

  @ManyToOne(() => UserEntity)
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  teamLead?: UserEntity;

  @OneToMany(() => UserEntity, user => user.team)
  members?: UserEntity[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  teamCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
