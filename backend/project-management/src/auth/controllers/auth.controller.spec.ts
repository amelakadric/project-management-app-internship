import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockRes: any = {};
  const mockReq: any = {
    user: { email: 'test@gmail.com', password: 'password' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockImplementation((param) => 'some jwt'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockRes = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return logged in user', () => {
    const user = controller.login(mockReq, mockRes);
    expect(user).resolves.toEqual(mockReq.user);
  });

  it('should log out user', () => {
    const user = controller.logout(mockRes);
    expect(user).resolves.toEqual({ message: 'User logged out.' });
    expect(mockRes.clearCookie).toHaveBeenCalledWith('jwt');
  });
});
