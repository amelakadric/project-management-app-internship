import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subscription } from 'rxjs';

import { UpdateProjectPageComponent } from './update-project-page.component';
import { UserModel } from '../../../models/user.model';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { ProjectModel } from '../../../models/project.model';
import { UsersActions } from '../../../user/store/actions/users.actions';
import { ProjectsActions } from '../../store/actions/projects.actions';

describe('UpdateProjectPageComponent', () => {
  let component: UpdateProjectPageComponent;
  let fixture: ComponentFixture<UpdateProjectPageComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProjectPageComponent, RouterModule.forRoot([])],
      providers: [provideMockStore({
        initialState: {
          projects: {
            project: new ProjectModel(1, "New Prject", new UserModel(1, 'Name', 'Surname', '', Genders.MALE, 'email@gmail.com', 'password123', Roles.MANAGER),
              [
                new UserModel(2, 'Name', 'Surname', '', Genders.MALE, 'email@gmail.com', 'password123', Roles.MANAGER)
              ], [])
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
        }]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(UpdateProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('sets id from route params', () => {
    expect(component.id).toEqual(123);
  });

  it('dispatches load action with the correct projectId when ngOnInit is called', () => {
    const dispatchSpy = jasmine.createSpy('dispatch');
    const storeMock = { dispatch: dispatchSpy };

    const fixture = TestBed.createComponent(UpdateProjectPageComponent);
    const component = fixture.componentInstance;
    const activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('123');
    component.ngOnInit();
    expect(activatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('projectId');

  });

  it('dispatches load action on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(ProjectsActions.load({ id: 123 }));
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadAll());
  });

  it('dispatches updateName action when updateProject is called', () => {
    component.projectForm.setValue({
      title: 'New Title',
      manager: '',
      employees: ''
    });

    component.updateProject(123);
    expect(store.dispatch).toHaveBeenCalledWith(ProjectsActions.updateName({projectId: 123, name: 'New Title'}));
  })

  it('dispatches updateManager action when changeManager is called', () => {
    component.projectForm.setValue({
      title: 'New Title',
      manager: '1',
      employees: ''
    });

    let managerId = parseInt(<string>component.projectForm.value.manager, 10);
    component.changeManager(123);
    expect(store.dispatch).toHaveBeenCalledWith(ProjectsActions.updateManager({projectId: 123, managerId: managerId}));
  })

  it('adds new employee and dispatch addEmployee action', () => {
    const projectId = 123;
    const employees: UserModel[] = [{id:2, firstname:'Name', lastname:'Surname', phoneNumber:'', gender: Genders.MALE, email:'email@gmail.com', password:'password123', role: Roles.MANAGER} as UserModel,
       {id:3, firstname:'Name', lastname:'Surname', phoneNumber:'', gender: Genders.MALE, email:'email@gmail.com', password:'password123', role: Roles.MANAGER} as UserModel,
    ];
    const selectedOption = 2;

    component.selectedOption = selectedOption;
    component.users = [...employees];

    component.onChange(projectId, employees);

    expect(component.users.length).toBe(3);
    expect(component.users.find(user => user.id === selectedOption)).toBeDefined();

    expect(store.dispatch).toHaveBeenCalledWith(
      ProjectsActions.addEmployee({ projectId, employeeId: selectedOption })
    );
  });

  it('unsubscribes from all subscriptions in ngOnDestroy', () => {
    const subscription1 = new Subscription();
    const subscription2 = new Subscription();

    component.subscriptions = [subscription1, subscription2];

    component.ngOnDestroy();

    expect(subscription1.closed).toBeTruthy();
    expect(subscription2.closed).toBeTruthy();
  });
});
