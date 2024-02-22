import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { ProjectsRepository } from '../../database/repositories/projects.repository';
import { Project } from '../../database/entities/project.entity';
import { UsersRepository } from '../../database/repositories/users.repository';
import { CreateTicketDto } from '../../tickets/dtos/createTicket.dto';
import { TicketsService } from '../../tickets/services/tickets.service';
import { Ticket } from '../../database/entities/ticket.entity';
import { Role } from '../../users/enums/roles.enum';

@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectsRepository,
    private userRepository: UsersRepository,
    private ticketService: TicketsService,
  ) {}

  isUserOnProject(userId: number, projectId: number): Promise<boolean> {
    return this.projectRepository.isUserOnProject(userId, projectId);
  }
  getAll(): Promise<Project[]> {
    return this.projectRepository.getAll();
  }
  getById(id: number): Promise<Project> {
    return this.projectRepository.getProjectById(id);
  }

  async getProjectsByManagerId(managerId: number): Promise<Project[]> {
    const user = await this.userRepository.getUserById(managerId);
    if (user.role !== Role.Manager) {
      throw new BadRequestException(
        `User with ${user.id} does not have the required Manager role`,
      );
    }
    return this.projectRepository.getProjectsByManagerId(managerId);
  }
  async create(projectData: CreateProjectDto): Promise<Project> {
    const { name, managerId, employees } = projectData;
    const managerEntity = await this.userRepository.getUserById(managerId);
    const employeesEntities =
      await this.userRepository.getUsersByIds(employees);

    return this.projectRepository.createProject(
      name,
      managerEntity,
      employeesEntities,
    );
  }

  async updateName(projectId: number, name: string): Promise<Project> {
    return this.projectRepository.updateName(projectId, name);
  }

  async updateManager(projectId: number, managerId: number): Promise<Project> {
    const manager = await this.userRepository.getUserById(managerId);
    if (!manager) {
      throw new NotFoundException(`Manager with id ${managerId} not found`);
    }
    return this.projectRepository.updateManager(projectId, manager);
  }

  async addEmployee(projectId: number, userId: number): Promise<Project> {
    const employee = await this.userRepository.getUserById(userId);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${userId} not found`);
    }
    return this.projectRepository.addEmployee(projectId, employee);
  }
  async removeEmployee(projectId: number, userId: number): Promise<Project> {
    const employee = await this.userRepository.getUserById(userId);
    if (!employee) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return this.projectRepository.removeEmployee(projectId, employee);
  }

  async addTicket(
    projectId: number,
    userId: number,
    createTicketDto: CreateTicketDto,
  ): Promise<Project> {
    const isUserOnProject = await this.projectRepository.isUserOnProject(
      createTicketDto.assignedTo,
      projectId,
    );
    if (!isUserOnProject) {
      throw new ForbiddenException(
        `User with id ${createTicketDto.assignedTo} is not on project with id ${projectId}.`,
      );
    }
    const project = await this.projectRepository.getProjectById(projectId);

    await this.ticketService.createTicket(project, userId, createTicketDto);
    return this.projectRepository.getProjectById(projectId);
  }

  async assignTicketToUser(
    projectId: number,
    ticketId: number,
    userId: number,
  ): Promise<Ticket> {
    const isUserOnProject = await this.projectRepository.isUserOnProject(
      userId,
      projectId,
    );
    if (!isUserOnProject) {
      throw new ForbiddenException(
        `User with id ${userId} is not on project with id ${projectId}.`,
      );
    }
    return this.ticketService.assignTicketToUser(projectId, ticketId, userId);
  }

  async removeTicket(projectId: number, ticketId: number): Promise<Project> {
    await this.ticketService.deleteTicket(ticketId);
    const updatedProject =
      await this.projectRepository.getProjectById(projectId);
    return updatedProject;
  }

  delete(id: number): Promise<Project> {
    return this.projectRepository.deleteProject(id);
  }
}
