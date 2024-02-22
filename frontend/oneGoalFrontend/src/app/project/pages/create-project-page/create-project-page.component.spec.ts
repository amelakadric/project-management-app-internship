import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CreateProjectPageComponent } from './create-project-page.component';
import { UsersActions } from '../../../user/store/actions/users.actions';
import { UserModel } from '../../../models/user.model';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { ProjectsActions } from '../../store/actions/projects.actions';

describe('CreateProjectPageComponent', () => {
  let component: CreateProjectPageComponent;
  let fixture: ComponentFixture<CreateProjectPageComponent>;
  let store: MockStore;
  let dialog: MatDialog;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProjectPageComponent],
      providers: [provideMockStore({}), MatDialog]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => ({
        subscribe: (callback: (result: boolean) => void) => {
          callback(true);
        },
      }),
    } as any);
    fixture = TestBed.createComponent(CreateProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches UsersActions.loadAll on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadAll());
  });

  it('adds user to addedEmployees array on onChange', () => {
    const user: UserModel = { id: 1, firstname:"Name", lastname: "Surname", gender:Genders.MALE, phoneNumber:"+3816577252", email:"email@gmail.com", password: "password123", role: Roles.EMPLOYEE};
    component.selectedOption = user;
    component.onChange();
    expect(component.addedEmployees).toContain(user);
  });

  it('removes user from addedEmployees array on removeEmployee', () => {
    const user: UserModel = { id: 1, firstname:"Name", lastname: "Surname", gender:Genders.MALE, phoneNumber:"+3816577252", email:"email@gmail.com", password: "password123", role: Roles.EMPLOYEE};
    component.addedEmployees = [user];
    component.removeEmployee(user);
    expect(component.addedEmployees).toEqual([]);
  });

  it('dispatches ProjectsActions.create on createProject when form is valid', () => {
    const manager: UserModel = { id: 1, firstname:"Name", lastname: "Surname", gender:Genders.MALE, phoneNumber:"+3816577252", email:"email@gmail.com", password: "password123", role: Roles.MANAGER};
    component.projectForm.setValue({
      title: 'Test Project',
      manager: manager.id.toString(),
      employees: ''
    });
    component.addedEmployees = [];

    spyOn(component, 'openMessageDialog');

    component.createProject([manager]);

    expect(component.projectForm.valid).toBeTrue();
    expect(store.dispatch).toHaveBeenCalledWith(ProjectsActions.create({
      name: 'Test Project',
      managerId: manager.id,
      employees: []
    }));
    expect(component.openMessageDialog).not.toHaveBeenCalled();
  });

  it('calls openMessageDialog when form is invalid on createProject', () => {
    component.projectForm.setValue({
      title: '',
      manager: '1',
      employees: ''
    });

    spyOn(component, 'openMessageDialog');

    component.createProject([]);

    expect(component.projectForm.valid).toBeFalse();
    expect(component.openMessageDialog).toHaveBeenCalledWith('All fields must be filled.');
  });

  it('opens message dialog when loginForm is invalid', () => {
    component.projectForm.setValue({
      title: '',
      manager: '',
      employees: ''
    })
    let managers = [];
    component.createProject(managers);

    expect(dialog.open).toHaveBeenCalled();
  });
});
