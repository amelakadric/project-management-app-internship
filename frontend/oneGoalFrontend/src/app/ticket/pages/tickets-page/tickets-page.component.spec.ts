import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { TicketsPageComponent } from './tickets-page.component';
import { TicketsActions } from '../../store/actions/tickets.actions';
import { Types } from '../../../enums/type.enum';

describe('TicketsPageComponent', () => {
  let component: TicketsPageComponent;
  let fixture: ComponentFixture<TicketsPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsPageComponent, RouterModule.forRoot([]),],
      providers: [provideMockStore({}),
        {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: () => 1
            }
          }
        }
      }]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TicketsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('sets id from route params', () => {
    expect(component.projectId).toEqual(1);
  });

  it('updates options with provided values on setOptions', () => {
    let initialOptions: { title?: string, userId?: number, ticketType?: Types };
    const newOptions = { title: 'New Title', userId: 2 };

    component.options = { ...initialOptions };
    component.setOptions(newOptions);

    expect(component.options).toEqual({ title: 'New Title', userId: 2 });
  });

  it('adds new options if they are not present in initial options on setOptions', () => {
    const initialOptions = { title: 'Initial Title', userId: 1 };
    const newOptions = { ticketType: Types.FEATURE };

    component.options = { ...initialOptions };
    component.setOptions(newOptions);

    expect(component.options).toEqual({ title: 'Initial Title', userId: 1, ticketType: Types.FEATURE });
  });

  it('handles empty options object on setOptions', () => {
    const initialOptions = { title: 'Initial Title', userId: 1 };

    component.options = { ...initialOptions };
    component.setOptions({});

    expect(component.options).toEqual({ title: 'Initial Title', userId: 1 });
  });

  it('dispatches TicketsActions.loadTicketsFromProject with correct options on searchForTitle', () => {
    const search = 'Example Title';

    component.projectId = 1;
    component.searchForTitle(search);

    expect(component.options.title).toEqual(search);
    expect(store.dispatch).toHaveBeenCalledWith(TicketsActions.loadTicketsFromProject({ id: 1, options: component.options }));
  });

  it('dispatches TicketsActions.loadTicketsFromProject with correct options on changeType', () => {
    const typeOption = 'feature';

    component.projectId = 1;
    component.typeSelectedOption = typeOption;
    component.changeType();

    expect(component.options.ticketType).toEqual(typeOption);
    expect(store.dispatch).toHaveBeenCalledWith(TicketsActions.loadTicketsFromProject({ id: 1, options: component.options }));
  });

  it('dispatches TicketsActions.loadTicketsFromProject with correct options on changeUser', () => {
    const userOption = 2;

    component.projectId = 1;
    component.userSelectedOption = userOption;
    component.changeUser();

    expect(component.options.userId).toEqual(userOption);
    expect(store.dispatch).toHaveBeenCalledWith(TicketsActions.loadTicketsFromProject({ id: 1, options: component.options }));
  });

  it('sets userId to -1 when userSelectedOption is -1 on changeUser', () => {
    component.projectId = 1;
    component.userSelectedOption = -1;
    component.changeUser();

    expect(component.options.userId).toEqual(-1);
    expect(store.dispatch).toHaveBeenCalledWith(TicketsActions.loadTicketsFromProject({ id: 1, options: component.options }));
  });
});
