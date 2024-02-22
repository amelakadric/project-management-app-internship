import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { TicketsBoardComponent } from './tickets-board.component';
import { DeleteDialogComponent } from '../../../delete-dialog/delete-dialog.component';
import { ProjectsActions } from '../../../project/store/actions/projects.actions';
import { Statuses } from '../../../enums/statuses.enum';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { UserModel } from '../../../models/user.model';
import { Priorities } from '../../../enums/priorities.enum';
import { Types } from '../../../enums/type.enum';
import { ProjectModel } from '../../../models/project.model';

describe('TicketsBoardComponent', () => {
  let component: TicketsBoardComponent;
  let fixture: ComponentFixture<TicketsBoardComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsBoardComponent],
      providers: [provideMockStore({})]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => ({
        subscribe: (callback: (result: boolean) => void) => {
          callback(true);
        },
      }),
    } as any);
    fixture = TestBed.createComponent(TicketsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('sorts tickets into arrays based on status', () => {
    component.tickets = [{
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
      status: Statuses.BACKLOG,
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
      status: Statuses.TODO,
      type: Types.TASK,
      project: {
        id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel
    },{
      id: 3,
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
      status: Statuses.INPROGRESS,
      type: Types.TASK,
      project: {
        id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel
    }, {
      id: 4,
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
    }]

    component.sortArrays();

    expect(component.backlogTickets.length).toBeGreaterThan(0);
    expect(component.backlogTickets.every(ticket => ticket.status === Statuses.BACKLOG)).toBeTrue();

    expect(component.toDoTickets.length).toBeGreaterThan(0);
    expect(component.toDoTickets.every(ticket => ticket.status === Statuses.TODO)).toBeTrue();

    expect(component.inProgressTickets.length).toBeGreaterThan(0);
    expect(component.inProgressTickets.every(ticket => ticket.status === Statuses.INPROGRESS)).toBeTrue();

    expect(component.doneTickets.length).toBeGreaterThan(0);
    expect(component.doneTickets.every(ticket => ticket.status === Statuses.DONE)).toBeTrue();
  });

  it('opens delete confirmation dialog', () => {
    component.ticketId = 1;
    component.openedDeleteConfirmationDialog();

    expect(dialog.open).toHaveBeenCalledWith(DeleteDialogComponent, jasmine.any(Object));
  });

  it('opens delete confirmation dialog and dispatch remove action when confirmed', () => {
    const ticketId = 1;
    component.projectId = 1;
    spyOn(component, 'openedDeleteConfirmationDialog').and.callThrough();

    component.actionToDelete(ticketId);

    expect(component.openedDeleteConfirmationDialog).toHaveBeenCalled();

    expect(store.dispatch).toHaveBeenCalledWith(ProjectsActions.removeTicket({ projectId: component.projectId, ticketId }));
  });

  it('moves item in the same container', () => {
    const event = {
      previousContainer: { data: [{
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
        }], id: '3' },
      container: { data: [{
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
        }, {
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
        }], id: '3' },
      previousIndex: 0,
      currentIndex: 1,
    } as any;

    component.drop(event);

    expect(event.container.data[0].id).toEqual(2);
    expect(event.container.data[1].id).toEqual(1);
  });

  it('moves item to different container', () => {
    const event = {
      previousContainer: { data: [{
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
        }], id: '2' },
      container: { data: [{
          id: 3,
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
        }], id: '3' },
      previousIndex: 0,
      currentIndex: 1,
    } as any;

    spyOn(component, 'findStatus').and.returnValue(Statuses.DONE);
    spyOn(component.updatedStatus, 'emit');

    component.drop(event);

    expect(component.findStatus).toHaveBeenCalledWith(event.container.id);
    expect(event.previousContainer.data[event.previousIndex].status).toBe(Statuses.DONE);

    expect(event.container.data.length).toEqual(2);

    expect(event.container.data[0].id).toEqual(3);
    expect(event.container.data[1].id).toEqual(1);

    expect(component.updatedStatus.emit).toHaveBeenCalledWith(event.container.data[event.currentIndex]);
  });

  it('finds correct status based on id', () => {
    expect(component.findStatus('0')).toEqual(Statuses.BACKLOG);
    expect(component.findStatus('1')).toEqual(Statuses.TODO);
    expect(component.findStatus('2')).toEqual(Statuses.INPROGRESS);
    expect(component.findStatus('3')).toEqual(Statuses.DONE);
    expect(component.findStatus(undefined)).toEqual(Statuses.BACKLOG);
    expect(component.findStatus('unknown')).toEqual(Statuses.BACKLOG);
  });
});
