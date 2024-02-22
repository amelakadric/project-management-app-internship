import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { UpdateTicketPageComponent } from './update-ticket-page.component';
import { Priorities } from '../../../enums/priorities.enum';

describe('UpdateTicketPageComponent', () => {
  let component: UpdateTicketPageComponent;
  let fixture: ComponentFixture<UpdateTicketPageComponent>;
  let router: Router;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTicketPageComponent, RouterModule.forRoot([])],
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

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(UpdateTicketPageComponent);
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

  it('returns correct enum value for low priority', () => {
    const lowPriority = 'low';

    const result = component.makeEnum(lowPriority);

    expect(result).toEqual(Priorities.LOW);
  });

  it('returns correct enum value for medium priority', () => {
    const lowPriority = 'medium';

    const result = component.makeEnum(lowPriority);

    expect(result).toEqual(Priorities.MEDIUM);
  });

  it('returns correct enum value for high priority', () => {
    const lowPriority = 'high';

    const result = component.makeEnum(lowPriority);

    expect(result).toEqual(Priorities.HIGH);
  });

  it('returns default enum value for undefined priority', () => {
    const lowPriority = '';

    const result = component.makeEnum(lowPriority);

    expect(result).toEqual(Priorities.LOW);
  });
});
