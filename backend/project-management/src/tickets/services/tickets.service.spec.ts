import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { TicketsRepository } from '../../database/repositories/tickets.repository';
import { Status } from '../enums/statuses.enum';
import { Priority } from '../enums/priorities.enum';
import { Type } from '../enums/types.enum';
import { UpdateTicketDto } from '../dtos/updateTicket.dto';
import { UsersRepository } from '../../database/repositories/users.repository';

describe('TicketsService', () => {
  let service: TicketsService;

  const mockUpdateTicket: UpdateTicketDto = {
    title: 'title',
    status: Status.ToDo,
    description: 'test',
    assignedTo: 1,
    priority: Priority.Medium,
    type: Type.Feature,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: TicketsRepository,
          useValue: {
            createTicket: jest.fn().mockImplementation((num, val) => val),
            getAll: jest.fn().mockImplementation(() => 'val'),
            getTicketById: jest
              .fn()
              .mockImplementation((projid, ticketid) => ticketid),
            getAssignedTickets: jest.fn().mockImplementation((val) => val),

            filterTickets: jest
              .fn()
              .mockImplementation((projid, userid, tickettype, title) => title),
            updateTicket: jest
              .fn()
              .mockImplementation((projid, ticketid, updateData) => updateData),
            assignTicketToUser: jest
              .fn()
              .mockImplementation((projid, ticketid, userid) => userid),
            deleteTicket: jest.fn().mockImplementation((val) => val),
            getCreatedTickets: jest.fn().mockImplementation((val) => val),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            getUserById: jest.fn().mockImplementation((val) => val),
          },
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all tickets', () => {
    const getAllTickets = service.getAll();
    expect(getAllTickets).resolves.toEqual('val');
  });

  it('should return ticket by id', () => {
    const getTicketById = service.getTicketById(1, 1);
    expect(getTicketById).resolves.toEqual(1);
  });

  it('should return filtered tickets', () => {
    const getTicketById = service.filterTickets(1, 1, Type.Feature, 'title');
    expect(getTicketById).resolves.toEqual('title');
  });

  it('should return updated ticket', () => {
    const getTicketById = service.updateTicket(1, 1, mockUpdateTicket);
    expect(getTicketById).resolves.toEqual(mockUpdateTicket);
  });

  it('should return assigned ticket', () => {
    const getTicketById = service.assignTicketToUser(1, 1, 1);
    expect(getTicketById).resolves.toEqual(1);
  });

  it('should return deleted ticket', () => {
    const getTicketById = service.deleteTicket(1);
    expect(getTicketById).resolves.toEqual(1);
  });
});
