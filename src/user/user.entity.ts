import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoleEnum } from "./user.role";
import { min } from "rxjs";
import * as bcrypt from 'bcrypt';
import { TeamEntity } from "src/team/team.entity";
import { Exclude } from "class-transformer";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid') 
    id: string

    @Column({
        length: 24,
        nullable: false
    })
    name: string

    @Column({
        unique: true,
        length: 24,
        nullable: false
    })
    email: string

    @Column({
        length: 10,
        nullable: false
    })
    userName: string

    @Column({
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.user
    })
    role: RoleEnum

    @Column({
        nullable: false
    })
    @Exclude()
    password: string

    @ManyToOne(() => TeamEntity, (team) => team.members, { nullable: true })
    team: TeamEntity

    @Exclude()
    @CreateDateColumn()
    createdAt: Date

    @Exclude()
    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

}