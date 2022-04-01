import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async Signup(authCredentialDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialDto;

    console.log(username);
    console.log(password);

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      console.log('userss');
      const userss = await user.save();
      console.log(userss);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialDto;
    const user = await this.findOne({ username });

    const passwordMatch = await user.validatePassword(password);

    if (user && passwordMatch) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
