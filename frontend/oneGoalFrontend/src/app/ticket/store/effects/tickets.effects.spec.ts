import { TestBed } from '@angular/core/testing';

import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { hot, cold } from 'jasmine-marbles';

import { TicketsEffects } from './tickets.effects';
import { TicketService } from '../../../services/ticket.service';
import { TicketsActions } from '../actions/tickets.actions';
import { TicketsActionsApi } from '../actions/tickets.actions-api';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { UserModel } from '../../../models/user.model';
import { Priorities } from '../../../enums/priorities.enum';
import { Statuses } from '../../../enums/statuses.enum';
import { Types } from '../../../enums/type.enum';
import { ProjectModel } from '../../../models/project.model';

describe('TicketsEffects', () => {
  let actions$: Observable<any>;
  let effects: TicketsEffects;
  let ticketService: jasmine.SpyObj<TicketService>;

  beforeEach(() => {
    ticketService = jasmine.createSpyObj('TicketService', ['getTicketsFromProject', 'getTicket', 'updateTicket']);

    TestBed.configureTestingModule({
      providers: [
        TicketsEffects,
        provideMockActions(() => actions$),
        {
          provide: TicketService,
          useValue: ticketService
        }
      ]
    });

    effects = TestBed.inject(TicketsEffects);
  });

  it('dispatches loadTicketsFromProjectSuccess action on loadTicketsFromProject action', () => {
    const tickets = [{
      id: 1,
      title: "Ticket 1",
      description: "Ticket 1",
      assignedTo: {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
      createdBy: {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
      priority: Priorities.MEDIUM,
      status: Statuses.DONE,
      type: Types.TASK,
      project: {
        id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel
    }, {
      id: 2,
      title: "Ticket 1",
      description: "Ticket 1",
      assignedTo: {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
      createdBy: {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
      priority: Priorities.MEDIUM,
      status: Statuses.DONE,
      type: Types.TASK,
      project: {
        id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel
    }];
    let initialOptions: { title?: string, userId?: number, ticketType?: Types };

    const action = TicketsActions.loadTicketsFromProject({id: tickets[0].project.id, options: initialOptions});

    ticketService.getTicketsFromProject.and.returnValue(of(tickets));

    const expectedAction = TicketsActionsApi.loadTicketsFromProjectSuccess({tickets});

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.getTicketsFromProject$).toBeObservable(expected$);
  });

  it('dispatches loadSuccess action on load action', () => {
    const ticket = {
      id: 1,
      title: "Ticket 1",
      description: "Ticket 1",
      assignedTo: {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
      createdBy: {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
      priority: Priorities.MEDIUM,
      status: Statuses.DONE,
      type: Types.TASK,
      project: {
        id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel
    };

    const action = TicketsActions.load({ projectId: ticket.project.id, ticketId: ticket.id });

    ticketService.getTicket.and.returnValue(of(ticket));

    const expectedAction = TicketsActionsApi.loadSuccess({ ticket });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.getTicket$).toBeObservable(expected$);
  });

  it('dispatches updateSuccess action on updateTicket action', () => {
    const ticket = {
      id: 1,
      title: "Ticket new",
      description: "Ticket 1",
      assignedTo: {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
      createdBy: {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
      priority: Priorities.MEDIUM,
      status: Statuses.DONE,
      type: Types.TASK,
      project: {
        id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel
    };

    const action = TicketsActions.update({ ticket });

    ticketService.updateTicket.and.returnValue(of(ticket));

    const expectedActions = [
      TicketsActionsApi.updateSuccess({ ticket }),
      TicketsActions.loadTicketsFromProject({ id: ticket.project.id, options: {} })
    ];

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-(ab)', { a: expectedActions[0], b: expectedActions[1] });

    expect(effects.updateTicket$).toBeObservable(expected$);
  });
});
