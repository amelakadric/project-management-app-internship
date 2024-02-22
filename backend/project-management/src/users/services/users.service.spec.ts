import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../../database/repositories/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Gender } from '../enums/genders.enum';
import { Role } from '../enums/roles.enum';
import { TicketsRepository } from '../../database/repositories/tickets.repository';
import { User } from 'src/database/entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser: User = {
    id: 1,
    email: 'test@gmail.com',
    password: 'test',
    firstname: 'Test',
    lastname: 'Testlast',
    role: Role.Employee,
    gender: Gender.Female,
    phoneNumber: '0123456',
    assignedTickets: [],
    createdTickets: [],
    employements: [],
    projects: [],
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getAll: jest.fn().mockImplementation(() => [mockUser]),
            getUserById: jest.fn().mockImplementation((userId) => userId),
            getUserByEmail: jest.fn().mockImplementation((userId) => userId),
            getUsersByRole: jest.fn().mockImplementation((val) => val),
            createUser: jest.fn().mockImplementation((val) => val),
            updateUser: jest.fn().mockImplementation((num, val) => val),
            deleteUser: jest.fn().mockImplementation((val) => val),
            getCreatedTickets: jest.fn().mockImplementation((val) => val),
            getAssignedTickets: jest.fn().mockImplementation((val) => val),
            getEmployments: jest.fn().mockImplementation((val) => val),
          },
        },
        {
          provide: TicketsRepository,
          useValue: {
            getAssignedTickets: jest.fn().mockImplementation((val) => val),
            getCreatedTickets: jest.fn().mockImplementation((val) => val),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', () => {
    const getAllUsers = service.getAll();
    expect(getAllUsers).resolves.toEqual([mockUser]);
  });

  it('should return user by id', () => {
    const user = service.getUserById(1);
    expect(user).resolves.toEqual(1);
  });
  it('should return user by email', () => {
    const user = service.getUserByEmail('email');
    expect(user).resolves.toEqual('email');
  });

  it('should return created user', () => {
    const user = service.create(mockCreateUser);
    expect(user).resolves.toEqual(mockCreateUser);
  });

  it('should return updated user', () => {
    const user = service.update(1, mockUpdateUser);
    expect(user).resolves.toEqual(mockUpdateUser);
  });

  it('should return deleted true', () => {
    const result = service.delete(1);
    expect(result).resolves.toEqual(1);
  });

  it('should return created tickets', () => {
    const tickets = service.getCreatedTickets(1);
    expect(tickets).resolves.toEqual(1);
  });

  it('should return assigned tickets', () => {
    const tickets = service.getAssignedTickets(1);
    expect(tickets).resolves.toEqual(1);
  });

  it('should return projects where user is employee', () => {
    const projects = service.getEmployments(1);
    expect(projects).resolves.toEqual(1);
  });
});
