import { TestBed } from '@angular/core/testing';

import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { cold, hot } from 'jasmine-marbles';

import { UsersEffects } from './users.effects';
import { UserService } from '../../../services/user.service';
import { UsersActions } from '../actions/users.actions';
import { UsersActionsApi } from '../actions/users.actions-api';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';

describe('UsersEffects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['getUsers', 'getUserWithId', 'getCurrentUser', 'createUser', 'login', 'logout']);

    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        {provide: UserService, useValue: userService},
      ],
    });

    effects = TestBed.inject(UsersEffects);
  });

  it('dispatches loadAllSuccess action on loadAll action', () => {
    const users = [
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE},
        {id: 2,
            firstname: 'Name',
            lastname: 'Surname',
            phoneNumber: '',
            gender: Genders.MALE,
            email: 'email@gmail.com',
            password: 'password123', role: Roles.EMPLOYEE}];

    const action = UsersActions.loadAll();

    userService.getUsers.and.returnValue(of(users));

    const expectedAction = UsersActionsApi.loadAllSuccess({ users });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.getUsers$).toBeObservable(expected$);
  });

  it('dispatches loadSuccess action on load action', () => {
    const user = {id: 1,
      firstname: 'Name',
      lastname: 'Surname',
      phoneNumber: '',
      gender: Genders.MALE,
      email: 'email@gmail.com',
      password: 'password123', role: Roles.EMPLOYEE};

    const action = UsersActions.load({ id: 1 });

    userService.getUserWithId.and.returnValue(of(user));

    const expectedAction = UsersActionsApi.loadSuccess({ user });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.getUser$).toBeObservable(expected$);
  });

  it('dispatches loadCurrentSuccess action on loadCurrent action', () => {
    const user = {id: 1,
      firstname: 'Name',
      lastname: 'Surname',
      phoneNumber: '',
      gender: Genders.MALE,
      email: 'email@gmail.com',
      password: 'password123', role: Roles.EMPLOYEE};

    const action = UsersActions.loadCurrent();

    userService.getCurrentUser.and.returnValue(of(user));

    const expectedAction = UsersActionsApi.loadCurrentSuccess({ user });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.getCurrentUser$).toBeObservable(expected$);
  });

  it('dispatches createSuccess action on create action', () => {
    const user = {id: 1,
      firstname: 'Name',
      lastname: 'Surname',
      phoneNumber: '',
      gender: Genders.MALE,
      email: 'email@gmail.com',
      password: 'password123', role: Roles.EMPLOYEE};

    const action = UsersActions.create({ user });

    userService.createUser.and.returnValue(of(user));

    const expectedAction = UsersActionsApi.createSuccess({ user });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.createUser$).toBeObservable(expected$);
  });

  it('dispatches loginSuccess action on login action', () => {
    const action = UsersActions.login({ email: 'test@example.com', password: 'password' });

    userService.login.and.returnValue(of(Roles.EMPLOYEE));

    const expectedAction = UsersActionsApi.loginSuccess({ role: Roles.EMPLOYEE });

    actions$ = hot('-a', { a: action });
    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.login$).toBeObservable(expected$);
  });

  it('dispatches logoutSuccess action on logout action', () => {
    const action = UsersActions.logout();

    userService.logout.and.returnValue(of('Logout successful'));

    const expectedAction = UsersActionsApi.logoutSuccess({ message: 'Logout successful' });

    actions$ = hot('-a', { a: action });
    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.logout$).toBeObservable(expected$);
  });
});
