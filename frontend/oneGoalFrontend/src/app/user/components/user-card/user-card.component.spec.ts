import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card.component';
import { Operations } from '../../../enums/operations.enum';
import { UserModel } from '../../../models/user.model';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.user = {
      id:1,
      firstname:"Name",
      lastname: "Surname",
      phoneNumber: "+381654363536",
      gender: Genders.MALE,
      email: "email@gmail.com",
      password: "password123",
      role: Roles.EMPLOYEE,
    } as UserModel;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to update-user route on UPDATE operation', () => {
    spyOn(component.router, 'navigate');
    component.responseToAction(Operations.UPDATE);
    expect(component.router.navigate).toHaveBeenCalledWith(['update-user/1']);
  });

  it('emits delete event on DELETE operation', () => {
    spyOn(component.delete, 'emit');
    component.responseToAction(Operations.DELETE);
    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });
});
