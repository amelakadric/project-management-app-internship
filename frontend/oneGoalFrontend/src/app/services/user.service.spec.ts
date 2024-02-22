import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { Roles } from '../enums/roles.enum';
import { UserModel } from '../models/user.model';
import { UserService } from './user.service';
import { environment } from '../../environment/environment';
import { Genders } from '../enums/genders.enum';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService, {provide: Router, useValue: {}}],
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('handles error when creating user', () => {
    const user: UserModel = {id: 1,
      firstname: 'Name',
      lastname: 'Surname',
      phoneNumber: '',
      gender: Genders.MALE,
      email: 'email@gmail.com',
      password: '', role: Roles.EMPLOYEE};

    service.createUser(user).subscribe((resultUser) => {
      expect(resultUser).toBeUndefined();
    });

    const req = httpTestingController.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush({ error: { message: 'Error creating user' } }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('handles error when logging in user', () => {
    const email = 'test@example.com';
    const password = 'password';

    service.login(email, password).subscribe((resultRole) => {
      expect(resultRole).toBeUndefined();
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ error: { message: 'Error logging in user' } }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('gets user by ID on success', () => {
    const userId = 1;
    const user: UserModel = {id: 1,
      firstname: 'Name',
      lastname: 'Surname',
      phoneNumber: '',
      gender: Genders.MALE,
      email: 'email@gmail.com',
      password: '', role: Roles.EMPLOYEE};

    service.getUserWithId(userId).subscribe((resultUser) => {
      expect(resultUser).toEqual(user);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/users/' + userId);
    expect(req.request.method).toBe('GET');
    req.flush({ user });
  });

  it('returns users on getUsers success', () => {
    const mockUsers: UserModel[] = [
      {id: 1,
        firstname: 'Name',
        lastname: 'Surname',
        phoneNumber: '',
        gender: Genders.MALE,
        email: 'email@gmail.com',
        password: '', role: Roles.EMPLOYEE},
        {id: 2,
        firstname: 'Name',
        lastname: 'Surname',
        phoneNumber: '',
        gender: Genders.MALE,
        email: 'email@gmail.com',
        password: '', role: Roles.EMPLOYEE}
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/users');
    expect(req.request.method).toBe('GET');
    req.flush({ users: mockUsers });
  });

  it('returns current user on getCurrentUser success', () => {
    const mockCurrentUser: UserModel = {id: 1,
      firstname: 'Name',
      lastname: '',
      phoneNumber: '',
      gender: Genders.MALE,
      email: 'email@gmail.com',
      password: '', role: Roles.EMPLOYEE};

    service.getCurrentUser().subscribe(currentUser => {
      expect(currentUser).toEqual(mockCurrentUser);
    });

    const req = httpTestingController.expectOne(environment.backendServerUrl + '/users/me');
    expect(req.request.method).toBe('GET');
    req.flush({ user: mockCurrentUser });
  });
});
