import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';

import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { hot, cold } from 'jasmine-marbles';

import { ProjectsActions } from '../actions/projects.actions';
import { ProjectsActionsApi } from '../actions/projects.actions-api';
import { ProjectService } from '../../../services/project.service';
import { ProjectsEffects } from './projects.effects';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';

describe('Projects Effects', () => {
  let actions$ = new Observable<Action>();
  let projectService: jasmine.SpyObj<ProjectService>;
  let effects: ProjectsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectsEffects,
        provideMockActions(() => actions$),
        {
          provide: ProjectService,
          useValue: jasmine.createSpyObj('ProjectService', ['getAllProjects', 'getProjectsById', 'getProjectsByManager', 'getProject', 'createProject', 'updateProjectName', 'updateManager'])
        }
        ],
    });
    effects = TestBed.inject(ProjectsEffects);
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('returns a loadAllSuccess action on successful project load', () => {
    const projects = [{ id: 1, name: 'Project 1', manager:
        {id: 1,
        firstname: 'Name',
        lastname: 'Surname',
        phoneNumber: '',
        gender: Genders.MALE,
        email: 'email@gmail.com',
        password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] },
      { id: 2, name: 'Project 2', manager:
          {id: 1,
        firstname: 'Name',
        lastname: 'Surname',
        phoneNumber: '',
        gender: Genders.MALE,
        email: 'email@gmail.com',
        password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] }];

    const action = ProjectsActions.loadAll();
    const completion = ProjectsActionsApi.loadAllSuccess({ projects });

    actions$ = hot('-a', { a: action });
    const response = cold('-b|', { b: projects });
    projectService.getAllProjects.and.returnValue(response);

    const expected = cold('--c', { c: completion });
    expect(effects.getProjects$).toBeObservable(expected);
  });

  it('dispatches loadUsersSuccess action on loadUsers action', () => {
    const userId = 123;
    const action = ProjectsActions.loadUsers({ id: userId });
    const projects = [{ id: 1, name: 'Project 1', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] },
      { id: 2, name: 'Project 2', manager:
          {id: 1,
            firstname: 'Name',
            lastname: 'Surname',
            phoneNumber: '',
            gender: Genders.MALE,
            email: 'email@gmail.com',
            password: 'password123', role: Roles.EMPLOYEE}, tickets: [], employees:[] }];

    projectService.getProjectsById.and.returnValue(of(projects));

    const expectedAction = ProjectsActionsApi.loadUsersSuccess({ projects });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.getUsersProjects$).toBeObservable(expected$);
  });

  it('dispatches loadManagersSuccess action on loadManagers action', () => {
    const userId = 1;
    const action = ProjectsActions.loadManagers({ id: userId });
    const projects = [{ id: 1, name: 'Project 1', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.MANAGER}, tickets: [], employees:[] },
      { id: 2, name: 'Project 2', manager:
          {id: 1,
            firstname: 'Name',
            lastname: 'Surname',
            phoneNumber: '',
            gender: Genders.MALE,
            email: 'email@gmail.com',
            password: 'password123', role: Roles.MANAGER}, tickets: [], employees:[] }];

    projectService.getProjectsByManager.and.returnValue(of(projects));

    const expectedAction = ProjectsActionsApi.loadManagersSuccess({ projects });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.getManagersProjects$).toBeObservable(expected$);
  });

  it('dispatches loadSuccess action on load action', () => {
    const projectId = 1;
    const action = ProjectsActions.load({ id: projectId });
    const project = { id: 1, name: 'Project 1', manager:
        {id: 1,
          firstname: 'Name',
          lastname: 'Surname',
          phoneNumber: '',
          gender: Genders.MALE,
          email: 'email@gmail.com',
          password: 'password123', role: Roles.MANAGER}, tickets: [], employees:[] };


    projectService.getProject.and.returnValue(of(project));

    const expectedAction = ProjectsActionsApi.loadSuccess({ project });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.getProject$).toBeObservable(expected$);
  });

  it('dispatches createSuccess action on create action', () => {
    const name = 'Test Project';
    const managerId = 1;
    const employees = [2, 3];
    const action = ProjectsActions.create({ name, managerId, employees });
    const project = { id: 1, name: name, manager:{id: 1,
        firstname: 'Name',
        lastname: 'Surname',
        phoneNumber: '',
        gender: Genders.MALE,
        email: 'email@gmail.com',
        password: 'password123', role: Roles.MANAGER}, tickets:[], employees:[] };

    projectService.createProject.and.returnValue(of(project));

    const expectedAction = ProjectsActionsApi.createSuccess({ project });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.createProject$).toBeObservable(expected$);
  });

  it('dispatches updateNameSuccess action on updateName action', () => {
    const projectId = 1;
    const name = 'Updated Project Name';
    const action = ProjectsActions.updateName({ projectId, name });
    const project = { id: 1, name: name, manager:{id: 1,
        firstname: 'Name',
        lastname: 'Surname',
        phoneNumber: '',
        gender: Genders.MALE,
        email: 'email@gmail.com',
        password: 'password123', role: Roles.MANAGER}, tickets:[], employees:[] };

    projectService.updateProjectName.and.returnValue(of(project));

    const expectedAction = ProjectsActionsApi.updateNameSuccess({ project });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.updateName$).toBeObservable(expected$);
  });

  it('dispatches updateManagerSuccess action on updateManager action', () => {
    const projectId = 1;
    const managerId = 1;
    const action = ProjectsActions.updateManager({ projectId, managerId });
    const project = { id: 1, name: 'Name', manager:{id: 1,
        firstname: 'Name',
        lastname: 'Surname',
        phoneNumber: '',
        gender: Genders.MALE,
        email: 'email@gmail.com',
        password: 'password123', role: Roles.MANAGER}, tickets:[], employees:[] };

    projectService.updateManager.and.returnValue(of(project));

    const expectedAction = ProjectsActionsApi.updateManagerSuccess({ project });

    actions$ = hot('-a', { a: action });

    const expected$ = cold('-b', { b: expectedAction });

    expect(effects.updateManager$).toBeObservable(expected$);
  });
})
