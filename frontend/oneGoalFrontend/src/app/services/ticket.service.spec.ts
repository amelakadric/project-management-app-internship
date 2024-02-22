import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TicketService } from './ticket.service';
import { Types } from '../enums/type.enum';
import { TicketModel } from '../models/ticket.model';
import { Genders } from '../enums/genders.enum';
import { Roles } from '../enums/roles.enum';
import { UserModel } from '../models/user.model';
import { Priorities } from '../enums/priorities.enum';
import { Statuses } from '../enums/statuses.enum';
import { ProjectModel } from '../models/project.model';
import { environment } from '../../environment/environment';

describe('TicketService', () => {
  let service: TicketService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketService],
    });
    service = TestBed.inject(TicketService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('returns tickets on getTicketsFromProjectSuccess', () => {
    const expectedTickets: TicketModel[] = [
      {id: 1,
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
        type: Types.FEATURE,
        project: {
          id: 1,
          name: 'new project',
          manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
          employees: [],
          tickets: []
        } as ProjectModel}
    ];

    const options = {
      title: 'Ticket',
      userId: 1,
      ticketType: Types.FEATURE,
    };

    service.getTicketsFromProject(1, options).subscribe(tickets => {
      expect(tickets).toEqual(expectedTickets);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + 1 + '/tickets?title=Ticket&userId=1&ticketType=feature');
    expect(req.request.method).toBe('GET');
    req.flush({ tickets: expectedTickets });
  });

  it('handles error on getTicketsFromProject failure', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const errorMessage = 'Http failure response for http://localhost:3000/projects/1/tickets?title=Ticket&userId=1&ticketType=feature: 404 Not Found';

    const options = {
      title: 'Ticket',
      userId: 1,
      ticketType: Types.FEATURE,
    };

    service.getTicketsFromProject(1, options).subscribe(
      () => fail('Expected an error, but the request succeeded'),
      (error) => {
        expect(error.message).toEqual(errorMessage);
      }
    );

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/1/tickets?title=Ticket&userId=1&ticketType=feature');
    expect(req.request.method).toBe('GET');
    req.flush({}, errorResponse);
  });

  it('gets ticket by Id on success', () => {
    const ticketId = 1;
    const projectId = 1;
    const ticket: TicketModel = {id: 1,
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
      type: Types.FEATURE,
      project: {
        id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel}

    service.getTicket(projectId, ticketId).subscribe((resultTicket) => {
      expect(resultTicket).toEqual(ticket);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/tickets/'+ ticketId);
    expect(req.request.method).toBe('GET');
    req.flush({ ticket });
  });

  it('handles error on getTicket failure', () => {
    const ticketId = 1;
    const projectId = 1;
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const errorMessage = 'Http failure response for http://localhost:3000/projects/1/tickets/1: 404 Not Found';

    service.getTicket(projectId, ticketId).subscribe(
      () => fail('Expected an error, but the request succeeded'),
      (error) => {
        expect(error.message).toEqual(errorMessage);
      }
    );

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + projectId + '/tickets/'+ ticketId);
    expect(req.request.method).toBe('GET');
    req.flush({}, errorResponse);
  });

  it('updates ticket and navigate to tickets on success', () => {
    const ticket: TicketModel = {id: 1,
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
      type: Types.FEATURE,
      project: {
        id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel};

    service.updateTicket(ticket).subscribe((project) => {
      expect(project).toEqual(ticket);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/projects/' + ticket.project.id + '/tickets/' + ticket.id);
    expect(req.request.method).toBe('PATCH');
    req.flush({ ticket });
  });
});
