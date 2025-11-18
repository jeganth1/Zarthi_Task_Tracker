import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleEnum } from './user.role';


@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
    constructor(private readonly userService: UserService) { }

    async onApplicationBootstrap() {
        await this.seedAdmin();
    }

    async seedAdmin() {
        const username = 'admin';

        const existing = await this.userService.findByUsername(username);
        if (existing) {
            console.log('Admin exists');
            return;
        }

        await this.userService.createAdminUser({
            name: process.env.ADMIN_USER!,
            email: process.env.ADMIN_EMAIL!,
            userName: process.env.ADMIN_USER!,
            password: process.env.ADMIN_PASSWORD!

        });

        console.log('Admin created successfully!');
    }
}
