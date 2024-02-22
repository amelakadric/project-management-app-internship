/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { Project } from '../../database/entities/project.entity';
import { CreateTicketDto } from '../../tickets/dtos/createTicket.dto';
import { TicketsService } from '../../tickets/services/tickets.service';
import { UpdateTicketDto } from '../../tickets/dtos/updateTicket.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Status } from '../../tickets/enums/statuses.enum';
import { Type } from '../../tickets/enums/types.enum';
import { Priority } from '../../tickets/enums/priorities.enum';
import { User } from '../../database/entities/user.entity';
import { Gender } from '../../users/enums/genders.enum';
import { Role } from '../../users/enums/roles.enum';
import { Ticket } from '../../database/entities/ticket.entity';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;
  let ticketsService: TicketsService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            getAll: jest
              .fn()
              .mockImplementation(() => [mockProject, mockProject]),
            getById: jest.fn().mockImplementation((id) => mockProject),
            create: jest
              .fn()
              .mockImplementation((mockCreateDto) => mockProject),
            updateName: jest.fn().mockImplementation((id, name) => mockProject),
            updateManager: jest
              .fn()
              .mockImplementation((id, managerId) => mockProject),
            addEmployee: jest
              .fn()
              .mockImplementation((id, userId) => mockProject),
            removeEmployee: jest
              .fn()
              .mockImplementation((id, userId) => mockProject),
            addTicket: jest
              .fn()
              .mockImplementation(
                (id: number, userId: number, mockCreateTicketDto) =>
                  mockProject,
              ),
            assignTicketToUser: jest
              .fn()
              .mockImplementation((id, ticketId, userId) => mockTicket),
            removeTicket: jest
              .fn()
              .mockImplementation((id, ticketId) => mockProject),
            delete: jest.fn().mockImplementation((id) => mockProject),
          },
        },
        {
          provide: TicketsService,
          useValue: {
            getTicketById: jest
              .fn()
              .mockImplementation((projectId, ticketId) => mockTicket),
            updateTicket: jest
              .fn()
              .mockImplementation(
                (projectId, ticketId, mockUpdateTicketDto) => mockTicket,
              ),
            filterTickets: jest
              .fn()
              .mockImplementation((projectId, userId, type, title) => [
                mockTicket,
                mockTicket,
              ]),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
    ticketsService = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all projects', async () => {
    const result = await controller.getAllProjects();
    expect(result).toEqual({ projects: [mockProject, mockProject] });
  });

  it('should return a project by id', async () => {
    const result = await controller.getProjectById(1);
    expect(result).toEqual({ project: mockProject });
  });

  it('should create a new project', async () => {
    const result = await controller.create(mockCreateDto);
    expect(result).toEqual({ project: mockProject });
  });

  it('should throw BadRequestException when trying to create a project with some invalid role for Manager or Employee', async () => {
    jest.spyOn(service, 'create').mockImplementationOnce(() => {
      throw new BadRequestException();
    });

    await expect(
      controller.create({ managerId: 2, ...mockCreateDto }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update project name', async () => {
    const result = await controller.updateName(1, { name: 'New Name' });
    mockProject.name = 'New Name';
    expect(result).toEqual({ project: mockProject });
  });

  it('should update the project manager', async () => {
    const updatedProject = await controller.updateManager(1, 1);
    expect(updatedProject).toEqual({ project: mockProject });
  });

  it('should throw NotFoundException if project does not exist', async () => {
    jest.spyOn(service, 'updateManager').mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(controller.updateManager(999, 2)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException when trying to update manager with one that does not have the Manager role', async () => {
    jest.spyOn(service, 'updateManager').mockImplementationOnce(() => {
      throw new BadRequestException();
    });

    await expect(controller.updateManager(1, 7)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should add an employee to the project', async () => {
    const updatedProject = await controller.addEmployee(1, 2);
    expect(updatedProject).toEqual({ project: mockProject });
  });

  it('should throw NotFoundException if user is not found when trying to add an employee that does not exist', async () => {
    jest.spyOn(service, 'addEmployee').mockImplementation(() => {
      throw new NotFoundException('Employee with id 999 not found');
    });

    await expect(controller.addEmployee(1, 999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException when trying to add an employee that does not have the Employee role', async () => {
    jest.spyOn(service, 'addEmployee').mockImplementationOnce(() => {
      throw new BadRequestException();
    });

    await expect(controller.addEmployee(1, 5)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should remove an employee from the project', async () => {
    const updatedProject = await controller.removeEmployee(1, 2);
    expect(updatedProject).toEqual({ project: mockProject });
  });

  it('should throw NotFoundException if user is not found when trying to remove an employee that does not exist', async () => {
    jest.spyOn(service, 'removeEmployee').mockImplementation(() => {
      throw new NotFoundException('User with id 999 not found');
    });

    await expect(controller.removeEmployee(1, 999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should add a ticket to the project', async () => {
    const mockReq = { user: { userId: 123 } };
    const updatedProject = await controller.addTicket(
      1,
      mockCreateTicketDto,
      mockReq,
    );
    expect(updatedProject).toEqual({ project: mockProject });
  });

  it('should assign a ticket to a user in the project', async () => {
    const updatedTicket = await controller.assignTicketToUser(1, 1, 2);
    expect(updatedTicket).toEqual({ ticket: mockTicket });
  });

  it('should throw NotFoundException if user is not found when trying to assign a ticket', async () => {
    jest.spyOn(service, 'assignTicketToUser').mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(controller.assignTicketToUser(1, 1, 999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a ticket from the project', async () => {
    const updatedProject = await controller.removeTicket(1, 1);
    expect(updatedProject).toEqual({ project: mockProject });
  });

  it('should delete the project', async () => {
    const isDeleted = await controller.delete(1);
    expect(isDeleted).toEqual({ isDeleted: true });
  });

  it('should throw NotFoundException if project is not found when trying to delete a project', async () => {
    jest.spyOn(service, 'delete').mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
  });
});
