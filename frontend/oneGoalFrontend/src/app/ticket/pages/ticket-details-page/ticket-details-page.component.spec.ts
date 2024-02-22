import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { TicketDetailsPageComponent } from './ticket-details-page.component';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { UserModel } from '../../../models/user.model';
import { Priorities } from '../../../enums/priorities.enum';
import { Statuses } from '../../../enums/statuses.enum';
import { Types } from '../../../enums/type.enum';
import { ProjectModel } from '../../../models/project.model';
import { TicketsActions } from '../../store/actions/tickets.actions';
import { TicketModel } from '../../../models/ticket.model';

describe('TicketDetailsPageComponent', () => {
  let component: TicketDetailsPageComponent;
  let fixture: ComponentFixture<TicketDetailsPageComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetailsPageComponent, RouterModule.forRoot([])],
      providers: [provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (param: string) => {
                  if (param === 'projectId') {
                    return '1';
                  } else if (param === 'ticketId') {
                    return '1';
                  }
                  return null;
                },
              },
            },
          },
        }]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TicketDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('sets id from route params', () => {
    expect(component.projectId).toEqual(1);
    expect(component.ticketId).toEqual(1);
  });

  it('dispatches load action on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(TicketsActions.load({ projectId:1, ticketId:1 }));
  });

  it('navigates to tickets when close is called', () => {
    spyOn(router, 'navigate');

    let ticket = new TicketModel( 10,
      {id: 1,
        name: 'new project',
        manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
        employees: [],
        tickets: []
      } as ProjectModel,
      "Ticket 1",
      "Ticket 1",
      new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
      new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
      Types.FEATURE,
      Priorities.LOW,
      Statuses.TODO);

    component.backToProject(ticket);
    expect(router.navigate).toHaveBeenCalledWith(['tickets/', ticket.project.id]);
  })
});
