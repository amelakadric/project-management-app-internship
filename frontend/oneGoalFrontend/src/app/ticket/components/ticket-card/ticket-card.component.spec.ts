import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCardComponent } from './ticket-card.component';
import { Operations } from '../../../enums/operations.enum';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { UserModel } from '../../../models/user.model';
import { Priorities } from '../../../enums/priorities.enum';
import { Statuses } from '../../../enums/statuses.enum';
import { Types } from '../../../enums/type.enum';
import { ProjectModel } from '../../../models/project.model';

describe('TicketCardComponent', () => {
  let component: TicketCardComponent;
  let fixture: ComponentFixture<TicketCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketCardComponent);
    component = fixture.componentInstance;
    component.ticket = {
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
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to update-ticket route on UPDATE operation', () =>{
    spyOn(component.router, 'navigate');
    component.responseToAction(Operations.UPDATE);
    expect(component.router.navigate).toHaveBeenCalledWith(['update-ticket/1/1']);
  });

  it('navigates to ticket-details route on DETAILS operation', () =>{
    spyOn(component.router, 'navigate');
    component.responseToAction(Operations.DETAILS);
    expect(component.router.navigate).toHaveBeenCalledWith(['ticket-details/1/1']);
  });

  it('emits delete event on DELETE operation', () => {
    spyOn(component.delete, 'emit');
    component.responseToAction(Operations.DELETE);
    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });

  it('returns correct image URL for each status', () => {
    const imageUrl = component.makeStatusImage();

    expect(imageUrl).toBe('../../assets/status-images/4.png');
  });

  it('returns default image URL for unknown status', () => {
    component.ticket.status =  null;

    const imageUrl = component.makeStatusImage();

    expect(imageUrl).toBe('../../assets/status-images/');
  });
});
