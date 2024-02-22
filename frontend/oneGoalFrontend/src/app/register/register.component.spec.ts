import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { RegisterComponent } from './register.component';
import { Genders } from '../enums/genders.enum';
import { UsersActions } from '../user/store/actions/users.actions';
import { UserModel } from '../models/user.model';
import { Roles } from '../enums/roles.enum';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideMockStore({}), MatDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

  it('dispatches createUser action when register is called', () => {
    component.registrationForm.setValue({
      firstName: "Name",
      lastName: "Surname",
      phoneNumber: "+381654237291",
      gender: Genders.MALE,
      email: "email@gmail.com",
      password: "password123"
    });

    expect(component.registrationForm.valid).toBeTruthy();
    let user = new UserModel(3,  "Name",
       "Surname",
       "+381654237291",
      Genders.MALE,
       "email@gmail.com",
       "password123",
      Roles.EMPLOYEE);

    component.registerUser();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.create({user}));
  });

  it('opens message dialog when registrationForm is invalid', () => {
    const invalidUserData = {
      firstName: '',
      lastName: 'Surname',
      phoneNumber: '',
      gender: Genders.MALE,
      email: 'email@gmail.com',
      password: 'password123',
    };
    component.registerUser();

    expect(dialog.open).toHaveBeenCalled();
  });
});
