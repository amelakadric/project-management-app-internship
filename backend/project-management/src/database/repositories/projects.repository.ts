import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { Role } from '../../users/enums/roles.enum';

@Injectable()
export class ProjectsRepository extends Repository<Project> {
  constructor(
    private dataSource: DataSource,
    manager?: EntityManager,
  ) {
    super(Project, manager ?? dataSource.createEntityManager());
  }

  async isUserOnProject(userId: number, projectId: number): Promise<boolean> {
    const project = await this.findOne({
      where: { id: projectId },
      relations: ['employees', 'manager'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    const foundAsEmployee = project.employees.find(
      (employee) => employee.id === userId,
    );

    const foundAsManager = project.manager.id === userId;

    if (!foundAsEmployee && !foundAsManager) {
      return false;
    }
    return true;
  }

  async getAll(): Promise<Project[]> {
    return await this.find({ relations: ['manager', 'employees', 'tickets'] });
  }

  async getProjectById(_id: number): Promise<Project> {
    const project = await this.findOne({
      where: { id: _id },
      relations: ['manager', 'employees', 'tickets'],
    });
    return project;
  }

  async getProjectsByManagerId(managerId: number): Promise<Project[]> {
    return this.find({
      where: { manager: { id: managerId } },
      relations: ['manager', 'employees', 'tickets'],
    });
  }

  async createProject(
    name: string,
    managerEntity: User,
    employeesEntities: User[],
  ): Promise<Project> {
    if (managerEntity.role !== Role.Manager) {
      throw new BadRequestException(
        `User does not have the required Manager role`,
      );
    }
    const nonEmployeeFound = employeesEntities.some(
      (employee) => employee.role !== Role.Employee,
    );

    if (nonEmployeeFound) {
      throw new BadRequestException(
        `One or more employees do not have the required Employee role`,
      );
    }
    const newProject = this.create({
      name: name,
      manager: managerEntity,
      employees: employeesEntities,
    });

    return this.save(newProject);
  }

  async updateName(projectId: number, name: string) {
    const project = await this.findOne({ where: { id: projectId } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    project.name = name;

    return this.save(project);
  }
  async updateManager(projectId: number, manager: User) {
    if (manager.role !== Role.Manager) {
      throw new BadRequestException(
        `User does not have the required Manager role`,
      );
    }
    const project = await this.findOne({
      where: { id: projectId },
      relations: ['manager', 'employees', 'tickets'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
    project.manager = manager;

    return await this.save(project);
  }

  async addEmployee(projectId: number, employee: User): Promise<Project> {
    const project = await this.findOne({
      where: { id: projectId },
      relations: ['employees'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
    if (employee.role !== Role.Employee) {
      throw new BadRequestException(
        `User does not have the required role for an employee.`,
      );
    }
    project.employees.push(employee);

    return await this.save(project);
  }

  async removeEmployee(projectId: number, user: User): Promise<Project> {
    const project = await this.findOne({
      where: { id: projectId },
      relations: ['employees'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
    const indexToRemove = project.employees.findIndex(
      (employee) => employee.id === user.id,
    );

    if (indexToRemove !== -1) {
      project.employees.splice(indexToRemove, 1);
      await this.save(project);
    } else {
      throw new NotFoundException(
        `User with id ${user.id} is not an employee on this project`,
      );
    }

    return project;
  }

  async removeTicket(projectId: number, ticketId: number): Promise<Project> {
    const project = await this.findOne({
      where: { id: projectId },
      relations: ['tickets'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    const indexToRemove = project.tickets.findIndex(
      (ticket) => ticket.id === ticketId,
    );

    if (indexToRemove !== -1) {
      project.tickets.splice(indexToRemove, 1);
      await this.save(project);
    } else {
      throw new NotFoundException(
        `Ticket with id ${ticketId} is not on this project`,
      );
    }
    return project;
  }

  async deleteProject(_id: number): Promise<Project> {
    const project = await this.findOne({ where: { id: _id } });

    if (!project) {
      throw new NotFoundException(`Project with id ${_id} not found`);
    }

    return this.remove(project);
  }
}
