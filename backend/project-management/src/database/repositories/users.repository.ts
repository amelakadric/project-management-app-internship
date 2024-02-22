import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { UpdateUserDto } from '../../users/dtos/update-user.dto';
import { Role } from '../../users/enums/roles.enum';
import { Project } from '../entities/project.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    manager?: EntityManager,
  ) {
    super(User, manager ?? dataSource.createEntityManager());
  }

  async getAll(): Promise<User[]> {
    return await this.find();
  }

  async getUsersByRole(role: Role): Promise<User[]> {
    return await this.find({ where: { role: role } });
  }

  async getUserById(_id: number): Promise<User> {
    const user = await this.findOne({ where: { id: _id } });

    if (!user) {
      throw new NotFoundException(`User with id ${_id} not found`);
    }

    return user;
  }
  async getUsersByIds(_ids: number[]): Promise<User[]> {
    const users = await this.findBy({ id: In(_ids) });
    if (users.length !== _ids.length) {
      const missingIds = _ids.filter(
        (id) => !users.some((user) => user.id === id),
      );
      throw new NotFoundException(
        `Users with ids ${missingIds.join(', ')} not found`,
      );
    }
    return users;
  }

  async getEmployments(userId: number): Promise<Project[]> {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['employements'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    return user.employements;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Email address ${userData.email} is already taken.`,
      );
    }
    const newUser = this.create(userData);
    return this.save(newUser);
  }

  async updateUser(_id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ where: { id: _id } });

    if (!user) {
      throw new NotFoundException(`User with id: ${_id} not found`);
    }

    Object.assign(user, updateUserDto);
    return await this.save(user);
  }

  async deleteUser(_id: number): Promise<User> {
    const user = await this.findOne({ where: { id: _id } });

    if (!user) {
      throw new NotFoundException(`User with id ${_id} not found`);
    }

    return this.remove(user);
  }
  async getUserByEmail(email: string) {
    const user = await this.findOne({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
