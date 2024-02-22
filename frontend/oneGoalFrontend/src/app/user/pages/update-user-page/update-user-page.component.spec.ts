import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { UpdateUserPageComponent } from './update-user-page.component';
import { UserModel } from '../../../models/user.model';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { UsersActions } from '../../store/actions/users.actions';

describe('UpdateUserPageComponent', () => {
  let component: UpdateUserPageComponent;
  let fixture: ComponentFixture<UpdateUserPageComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUserPageComponent, RouterModule.forRoot([]),],
      providers: [
        provideMockStore({
          initialState: {
            users: {
              user: new UserModel(1, 'Name', 'Surname', '', Genders.MALE, 'email@gmail.com', 'password123', Roles.EMPLOYEE)
            }
          }
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 123
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(UpdateUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('sets id from route params', () => {
    expect(component.id).toEqual(123);
  });

  it('dispatches load action with the correct userId when ngOnInit is called', () => {
    const dispatchSpy = jasmine.createSpy('dispatch');
    const storeMock = { dispatch: dispatchSpy };

    const fixture = TestBed.createComponent(UpdateUserPageComponent);
    const component = fixture.componentInstance;
    const activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('123');
    component.ngOnInit();
    expect(activatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('userId');

  });

  it('dispatches load action on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.load({ id: 123 }));
  });

  it('dispatches update and loadAll actions when updatedUser is called', () => {
    spyOn(router, 'navigate');
    component.updateUserForm.setValue({
      firstName: 'Name',
      lastName: 'Surname',
      gender: Genders.MALE,
      phoneNumber: '',
      email: 'email@gmail.com',
      password: 'password123',
      role: Roles.MANAGER
    });

    component.updatedUser();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadAll());
  });
});
