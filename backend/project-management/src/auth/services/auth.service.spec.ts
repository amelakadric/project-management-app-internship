import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../users/enums/roles.enum';
import { Gender } from '../../users/enums/genders.enum';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn().mockImplementation((param) => mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((payload) => payload),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user', () => {
    const user = service.validateUser('test@gmail.com', 'test');
    expect(user).resolves.toEqual({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });
  });
  it('should return jwt', () => {
    const jwt = service.login(mockUser);
    expect(jwt).resolves.toEqual({
      email: mockUser.email,
      sub: mockUser.id,
      role: mockUser.role,
    });
  });
});
