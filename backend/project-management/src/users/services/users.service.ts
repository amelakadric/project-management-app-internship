import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersRepository } from '../../database/repositories/users.repository';
import { TicketsRepository } from '../../database/repositories/tickets.repository';
import { Ticket } from '../../database/entities/ticket.entity';
import { Role } from '../enums/roles.enum';
import { Project } from '../../database/entities/project.entity';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private ticketsRepository: TicketsRepository,
  ) {}

  async getAll() {
    return this.userRepository.getAll();
  }

  async getUsersByRole(role: Role) {
    return this.userRepository.getUsersByRole(role);
  }

  async create(userData: CreateUserDto) {
    return this.userRepository.createUser(userData);
  }

  async update(id: number, userData: UpdateUserDto) {
    return this.userRepository.updateUser(id, userData);
  }

  async delete(id: number) {
    return this.userRepository.deleteUser(id);
  }

  async getCreatedTickets(id: number): Promise<Ticket[]> {
    const user = await this.userRepository.getUserById(id);
    return this.ticketsRepository.getCreatedTickets(user);
  }

  async getAssignedTickets(id: number): Promise<Ticket[]> {
    const user = await this.userRepository.getUserById(id);
    return this.ticketsRepository.getAssignedTickets(user);
  }
  async getEmployments(userId: number): Promise<Project[]> {
    return this.userRepository.getEmployments(userId);
  }
  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async getUserById(id: number) {
    return this.userRepository.getUserById(id);
  }
}
