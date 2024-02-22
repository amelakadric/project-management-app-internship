import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoginComponent } from './login.component';
import { UsersActions } from '../user/store/actions/users.actions';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideMockStore({}), MatDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(dialog, 'open');
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches login action when loginUser is called', () => {
    component.loginForm.setValue({
      email: "email@gmail.com",
      password: "password123"
    });

    expect(component.loginForm.valid).toBeTruthy();
    let email = "email@gmail.com";
    let password = "password123";
    component.loginUser();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.login({email, password}));
  });

  it('opens message dialog when loginForm is invalid', () => {
    const invalidUserData = {
      email: '',
      password: 'password123',
    };
    component.loginUser();

    expect(dialog.open).toHaveBeenCalled();
  });


});
