/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from '../../database/repositories/projects.repository';
import { TicketsRepository } from '../../database/repositories/tickets.repository';
import { UsersRepository } from '../../database/repositories/users.repository';
import { TicketsService } from '../../tickets/services/tickets.service';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { Project } from '../../database/entities/project.entity';
import { Ticket } from '../../database/entities/ticket.entity';
import { User } from '../../database/entities/user.entity';
import { CreateTicketDto } from '../../tickets/dtos/createTicket.dto';
import { UpdateTicketDto } from '../../tickets/dtos/updateTicket.dto';
import { Priority } from '../../tickets/enums/priorities.enum';
import { Status } from '../../tickets/enums/statuses.enum';
import { Gender } from '../../users/enums/genders.enum';
import { Role } from '../../users/enums/roles.enum';
import { Type } from '../../tickets/enums/types.enum';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectsRepository: ProjectsRepository;
  let usersRepository: UsersRepository;
  let ticketsService: TicketsService;
  let ticketsRepository: TicketsRepository;

  const mockCreateDto: CreateProjectDto = {
    name: 'Project 1',
    managerId: 1,
    employees: [],
  };

  const mockUser: User = {
    id: 2,
    email: 'mock@mail.com',
    password: '123',
    firstname: 'Mock',
    lastname: 'User',
    gender: Gender.Male,
    role: Role.Employee,
    phoneNumber: '066123123',
    createdTickets: [],
    assignedTickets: [],
    projects: [],
    employements: [],
  };
  const mockManager = { id: 1, role: Role.Manager, ...mockUser };

  const mockProject: Project = {
    id: 1,
    name: 'Project 1',
    manager: mockManager,
    employees: [],
    tickets: [],
  };

  const mockTicket: Ticket = {
    id: 1,
    status: Status.Backlog,
    title: 'Mock ticket',
    description: 'Mock description',
    type: Type.Bug,
    priority: Priority.Medium,
    assignedTo: mockUser,
    createdBy: mockUser,
    project: mockProject,
  };

  const mockCreateTicketDto: CreateTicketDto = {
    status: Status.Backlog,
    title: 'Mock ticket',
    description: 'Mock description',
    type: Type.Bug,
    priority: Priority.Medium,
    assignedTo: 1,
  };

  const mockUpdateTicketDto: UpdateTicketDto = { status: Status.InProgress };

  let mockBoolean: boolean = true;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        TicketsService,
        UsersRepository,
        TicketsRepository,
        ProjectsRepository,
        {
          provide: UsersRepository,
          useValue: {
            getUserById: jest.fn().mockImplementation((userId) => userId),
            getUsersByIds: jest
              .fn()
              .mockImplementation((ids: number[]) => [mockUser, mockUser]),
          },
        },
        {
          provide: ProjectsRepository,
          useValue: {
            isUserOnProject: jest
              .fn()
              .mockImplementation((userId, projectId) => mockBoolean),
            getAll: jest
              .fn()
              .mockImplementation(() => [mockProject, mockProject]),
            getProjectById: jest
              .fn()
              .mockImplementation((projectId) => mockProject),
            getProjectsByManagerId: jest
              .fn()
              .mockImplementation((managerId) => [mockProject, mockProject]),
            createProject: jest
              .fn()
              .mockImplementation(
                (name, managerEntity, employeesEntities) => mockProject,
              ),
            updateName: jest
              .fn()
              .mockImplementation((projectId, name) => mockProject),
            updateManager: jest
              .fn()
              .mockImplementation((projectId, manager) => mockProject),
            addEmployee: jest
              .fn()
              .mockImplementation((projectId, employee) => mockProject),
            removeEmployee: jest
              .fn()
              .mockImplementation((projectId, user) => mockProject),
            addTicket: jest
              .fn()
              .mockImplementation(
                (projectId, mockCreateTicketDto) => mockProject,
              ),
            removeTicket: jest
              .fn()
              .mockImplementation((projectId, ticketId) => mockProject),
            deleteProject: jest.fn().mockImplementation((id) => mockProject),
          },
        },
        {
          provide: TicketsService,
          useValue: {
            createTicket: jest
              .fn()
              .mockImplementation(
                (project, userId, mockCreateTicketDto) => mockTicket,
              ),
            deleteTicket: jest.fn().mockImplementation((id) => mockTicket),
            assignTicketToUser: jest
              .fn()
              .mockImplementation((projectId, ticketId, userId) => mockTicket),
          },
        },
        {
          provide: TicketsRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectsRepository = module.get<ProjectsRepository>(ProjectsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    ticketsService = module.get<TicketsService>(TicketsService);
    ticketsRepository = module.get<TicketsRepository>(TicketsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true if the user is on the project', async () => {
    mockBoolean = true;
    const result = await service.isUserOnProject(1, 1);
    expect(result).toBe(true);
  });

  it('should return false if the user is not on the project', async () => {
    mockBoolean = false;
    const result = await service.isUserOnProject(2, 1);
    expect(result).toBe(false);
  });

  it('should return all projects', async () => {
    const result = await service.getAll();
    expect(result).toEqual([mockProject, mockProject]);
  });

  it('should return a project by given id', async () => {
    const result = await service.getById(1);
    expect(result).toEqual(mockProject);
  });

  it('should throw BadRequestException for non-manager user', async () => {
    jest
      .spyOn(usersRepository, 'getUserById')
      .mockImplementationOnce(() => Promise.resolve(mockManager));

    await expect(service.getProjectsByManagerId(1)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update project name', async () => {
    mockProject.name = 'New Name';
    const result = await service.updateName(1, 'New Name');
    expect(result).toEqual(mockProject);
  });

  it('should update the project manager', async () => {
    mockProject.manager = { firstname: 'New Manager', ...mockManager };
    const result = await service.updateManager(1, 1);
    expect(result).toEqual(mockProject);
  });

  it('should throw NotFoundException if project does not exist when updating manager', async () => {
    jest.spyOn(projectsRepository, 'updateManager').mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(service.updateManager(999, 2)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should add an employee to the project', async () => {
    mockProject.employees = [mockUser];
    const result = await service.addEmployee(1, 2);
    expect(result).toEqual(mockProject);
  });

  it('should throw NotFoundException if user is not found when trying to add an employee', async () => {
    jest.spyOn(usersRepository, 'getUserById').mockImplementation(() => {
      throw new NotFoundException('Employee with id 999 not found');
    });

    await expect(service.addEmployee(1, 999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove an employee from the project', async () => {
    mockProject.employees = [];
    const result = await service.removeEmployee(1, 2);
    expect(result).toEqual(mockProject);
  });

  it('should throw NotFoundException if user is not found when trying to remove an employee', async () => {
    jest.spyOn(usersRepository, 'getUserById').mockImplementation(() => {
      throw new NotFoundException('User with id 999 not found');
    });

    await expect(service.removeEmployee(1, 999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should add a ticket to the project', async () => {
    mockProject.tickets = [mockTicket];
    jest
      .spyOn(projectsRepository, 'isUserOnProject')
      .mockResolvedValueOnce(true);

    const result = await service.addTicket(1, 123, mockCreateTicketDto);
    expect(result).toEqual(mockProject);
  });

  it('should throw ForbiddenException if user is not on the project when adding a ticket', async () => {
    jest
      .spyOn(projectsRepository, 'isUserOnProject')
      .mockResolvedValueOnce(false);

    await expect(
      service.addTicket(1, 123, mockCreateTicketDto),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should assign a ticket to a user in the project', async () => {
    mockTicket.assignedTo = mockUser;
    jest
      .spyOn(projectsRepository, 'isUserOnProject')
      .mockResolvedValueOnce(true);

    const result = await service.assignTicketToUser(1, 1, 2);
    expect(result).toEqual(mockTicket);
  });

  it('should throw ForbiddenException if user is not on the project when assigning a ticket', async () => {
    jest
      .spyOn(projectsRepository, 'isUserOnProject')
      .mockResolvedValueOnce(false);

    await expect(service.assignTicketToUser(1, 1, 999)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should remove a ticket from the project', async () => {
    mockProject.tickets = [];
    const result = await service.removeTicket(1, 1);
    expect(result).toEqual(mockProject);
  });

  it('should delete the project', async () => {
    const result = await service.delete(1);
    expect(result).toEqual(mockProject);
  });

  it('should throw NotFoundException if project is not found when trying to delete a project', async () => {
    jest
      .spyOn(projectsRepository, 'deleteProject')
      .mockRejectedValue(
        new NotFoundException('Project with id 999 not found'),
      );

    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
  });
});
