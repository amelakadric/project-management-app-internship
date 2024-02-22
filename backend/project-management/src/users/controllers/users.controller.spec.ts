import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Role } from '../enums/roles.enum';
import { Gender } from '../enums/genders.enum';
import { UpdateUserDto } from '../dtos/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockCreateUser: CreateUserDto = {
    email: 'test@gmail.com',
    password: 'test',
    firstname: 'Test',
    lastname: 'Testlast',
    role: Role.Employee,
    gender: Gender.Female,
    phoneNumber: '0123456',
  };

  const mockUpdateUser: UpdateUserDto = {
    email: 'test@gmail.com',
    firstname: 'Test',
    lastname: 'Testlast',
    role: Role.Employee,
    gender: Gender.Female,
    phoneNumber: '0123456',
  };
  const req = { user: { userId: 1 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn().mockImplementation(() => 'value'),
            getUserById: jest.fn().mockImplementation((userId) => userId),
            getUsersByRole: jest.fn().mockImplementation((val) => val),
            create: jest.fn().mockImplementation((val) => val),
            update: jest.fn().mockImplementation((num, val) => val),
            delete: jest.fn().mockImplementation((val) => val),
            getCreatedTickets: jest.fn().mockImplementation((val) => val),
            getAssignedTickets: jest.fn().mockImplementation((val) => val),
            getEmployments: jest.fn().mockImplementation((val) => val),
          },
        },
        {
          provide: ProjectsService,
          useValue: {
            getProjectsByManagerId: jest.fn().mockImplementation((val) => val),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', () => {
    const getAllUsers = controller.getAllUsers();
    expect(getAllUsers).resolves.toEqual({ users: 'value' });
  });

  it('should return loggedInUser', () => {
    const loggedInUser = controller.getLoggedInUser(req);
    expect(loggedInUser).resolves.toEqual({ user: 1 });
  });

  it('should return user by id', () => {
    const user = controller.getUserById(1);
    expect(user).resolves.toEqual({ user: 1 });
  });

  it('should return created user', () => {
    const user = controller.create(mockCreateUser);
    expect(user).resolves.toEqual({ user: mockCreateUser });
  });

  it('should return updated user', () => {
    const user = controller.update(1, mockUpdateUser);
    expect(user).resolves.toEqual({ updatedUser: mockUpdateUser });
  });

  it('should return deleted true', () => {
    const result = controller.delete(1);
    expect(result).resolves.toEqual({ isDeleted: true });
  });

  it('should return created tickets', () => {
    const tickets = controller.getCreatedTickets(1);
    expect(tickets).resolves.toEqual({ tickets: 1 });
  });

  it('should return assigned tickets', () => {
    const tickets = controller.getAssignedTickets(1);
    expect(tickets).resolves.toEqual({ tickets: 1 });
  });

  it('should return projects managed by user', () => {
    const projects = controller.getManagedProjects(1);
    expect(projects).resolves.toEqual({ projects: 1 });
  });

  it('should return projects where user is employee', () => {
    const projects = controller.getEmployments(1);
    expect(projects).resolves.toEqual({ projects: 1 });
  });
});
