import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isValid = await this.userService.validatePassword(user, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
     try {
    const payload = {
      id: user.id,
      role: user.role,
      username: user.userName,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      message: 'Login successful',
      'jwt token': token,
      'user id': user.id
    };
    } catch (error) {
      console.error("JWT Error:", error);

      // Internal server error if token generation fails
      throw new InternalServerErrorException({
        success: false,
        message: 'Something went wrong while generating token',
      });
    }
  }
}
