import { TestBed, async, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { UserService } from '../services/user.service';
import { Roles } from '../enums/roles.enum';
import { UserModel } from '../models/user.model';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;
  let store: MockStore;

  const initialState = {
    users: {
      currentUser: null,
    },
  };

  beforeEach(() => {
    const userSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: UserService, useValue: userSpy },
        provideMockStore({ initialState }),
      ],
    });

    guard = TestBed.inject(AuthGuard);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    userService.getCurrentUser.and.returnValue(of(null));
  });

  it('creates', () => {
    expect(guard).toBeTruthy();
  });

  it('returns true if user role is in requiredRoles', async(inject(
    [Router, AuthGuard],
    (router: Router, guard: AuthGuard) => {
      const routeSnapshot = new ActivatedRouteSnapshot();
      routeSnapshot.data = { requiredRole: [Roles.ADMIN] };

      store.setState({
        users: {
          currentUser: { role: Roles.ADMIN } as UserModel,
        },
      });

      guard.canActivate(routeSnapshot).subscribe((result) => {
        expect(result).toBe(true);
      });
    },
  )));

  it('return false and navigate to login if user role is not in requiredRoles', async(inject(
    [Router, AuthGuard],
    (router: Router, guard: AuthGuard) => {
      const routeSnapshot = new ActivatedRouteSnapshot();
      routeSnapshot.data = { requiredRole: [Roles.ADMIN] };

      store.setState({
        users: {
          currentUser: { role: Roles.EMPLOYEE } as UserModel,
        },
      });

      const navigateSpy = spyOn(router, 'navigate');

      guard.canActivate(routeSnapshot).subscribe((result) => {
        expect(result).toBe(false);
        expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      });
    },
  )));
});
