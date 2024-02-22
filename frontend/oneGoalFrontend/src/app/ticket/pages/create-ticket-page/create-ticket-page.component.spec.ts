import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CreateTicketPageComponent } from './create-ticket-page.component';
import { Genders } from '../../../enums/genders.enum';
import { UserModel } from '../../../models/user.model';
import { Roles } from '../../../enums/roles.enum';
import { TicketModel } from '../../../models/ticket.model';
import { ProjectModel } from '../../../models/project.model';

describe('CreateTicketPageComponent', () => {
  let component: CreateTicketPageComponent;
  let fixture: ComponentFixture<CreateTicketPageComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTicketPageComponent, RouterModule.forRoot([])],
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
    fixture = TestBed.createComponent(CreateTicketPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('creates ticket successfully', () => {
    component.createTicketForm.setValue({
      title: "Ticket 1",
      description: "Ticket 1",
      assignedTo: '1',
      type: 'feature',
      priority: 'low'
    })

    component.employees = [
      {
        id:1,
        firstname:"Name",
        lastname: "Surname",
        phoneNumber: "+381654363536",
        gender: Genders.MALE,
        email: "email@gmail.com",
        password: "password123",
        role: Roles.EMPLOYEE,
      } as UserModel,
    ];

    let project = {id: 1,
      name: 'new project',
      manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
      employees: [],
      tickets: []
    } as ProjectModel;

    component.createTicket(component.employees, project);

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Projects] Add Ticket',
      ticket: jasmine.any(TicketModel)
    }));

  });

  it('opens message dialog when registrationForm is invalid', () => {
    component.createTicketForm.setValue({
      title: "Ticket 1",
      description: "",
      assignedTo: '1',
      type: 'feature',
      priority: 'low'
    })
    component.createTicket([], {id: 1,
      name: 'new project',
      manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
      employees: [],
      tickets: []
    } as ProjectModel);

    expect(dialog.open).toHaveBeenCalled();
  });
});
