import { TestBed } from '@angular/core/testing';

import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { ProjectFeature, initialProjectState } from './project.reducer';
import { ProjectsActionsApi } from '../actions/projects.actions-api';
import { ProjectsActions } from '../actions/projects.actions';
import { ProjectType } from '../../../types/project.type';

describe('Projects Reducer', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: {projects: initialProjectState} }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('sets isLoading to true on ProjectsActions.loadAll', () => {
    const action = ProjectsActions.loadAll();
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads projects in projectArray on ProjectsActionsApi.loadAllSuccess', () => {
    const projects = <ProjectType[]>{};
    const action = ProjectsActionsApi.loadAllSuccess({projects});
    const expectedState = {
      ...initialProjectState,
      projectArray: projects,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.loadAllFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.loadAllFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.loadUsers', () => {
    const id = <number>{};
    const action = ProjectsActions.loadUsers({id});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads projects in projectArray on ProjectsActionsApi.loadUsersSuccess', () => {
    const projects = <ProjectType[]>{};
    const action = ProjectsActionsApi.loadUsersSuccess({projects});
    const expectedState = {
      ...initialProjectState,
      projectArray: projects,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.loadUsersFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.loadUsersFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.loadManagers', () => {
    const id = <number>{};
    const action = ProjectsActions.loadManagers({id});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads projects in projectArray on ProjectsActionsApi.loadManagersSuccess', () => {
    const projects = <ProjectType[]>{};
    const action = ProjectsActionsApi.loadManagersSuccess({projects});
    const expectedState = {
      ...initialProjectState,
      projectArray: projects,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.loadManagersFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.loadManagersFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.load', () => {
    const id = <number>{};
    const action = ProjectsActions.load({id});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads project in project and sets usersArray and ticketsArray on ProjectsActionsApi.loadSuccess', () => {
    const project = <ProjectType>{};
    const action = ProjectsActionsApi.loadSuccess({project});
    const expectedState = {
      ...initialProjectState,
      project: project,
      usersArray: project.employees,
      ticketsArray: project.tickets,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.loadFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.loadFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.create', () => {
    const name = <string>{};
    const managerId = <number>{};
    const employees = <number[]>{};
    const action = ProjectsActions.create({name, managerId, employees});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('adds project in projectArray on ProjectsActionsApi.createSuccess', () => {
    const project = <ProjectType>{};
    const action = ProjectsActionsApi.createSuccess({project});
    const expectedState = {
      ...initialProjectState,
      projectArray: [...initialProjectState.projectArray, project],
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.createFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.createFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.remove', () => {
    const id = <number>{};
    const action = ProjectsActions.remove({id});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to false on ProjectsActionsApi.removeSuccess', () => {
    const isRemoved = <boolean>{};
    const action = ProjectsActionsApi.removeSuccess({isRemoved});
    const expectedState = {
      ...initialProjectState,
      isLoading: false,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.removeFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.removeFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.updateName', () => {
    const projectId = <number>{};
    const name = <string>{};
    const action = ProjectsActions.updateName({projectId, name});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads project in project on ProjectsActionsApi.updateNameSuccess', () => {
    const project = <ProjectType>{};
    const action = ProjectsActionsApi.updateNameSuccess({project});
    const expectedState = {
      ...initialProjectState,
      project: project,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.updateNameFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.updateNameFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.updateManager', () => {
    const projectId = <number>{};
    const managerId = <number>{};
    const action = ProjectsActions.updateManager({projectId, managerId});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads project in project on ProjectsActionsApi.updateManagerSuccess', () => {
    const project = <ProjectType>{};
    const action = ProjectsActionsApi.updateManagerSuccess({project});
    const expectedState = {
      ...initialProjectState,
      project: project,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.updateManagerFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.updateNameFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.addEmployee', () => {
    const projectId = <number>{};
    const employeeId = <number>{};
    const action = ProjectsActions.addEmployee({projectId, employeeId});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads project in project on ProjectsActionsApi.addEmployeeSuccess', () => {
    const project = <ProjectType>{};
    const action = ProjectsActionsApi.addEmployeeSuccess({project});
    const expectedState = {
      ...initialProjectState,
      project: project,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.addEmployeeFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.addEmployeeFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on ProjectsActions.removeEmployee', () => {
    const projectId = <number>{};
    const employeeId = <number>{};
    const action = ProjectsActions.removeEmployee({projectId, employeeId});
    const expectedState = {
      ...initialProjectState,
      isLoading: true,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads project in project on ProjectsActionsApi.removeEmployeeSuccess', () => {
    const project = <ProjectType>{};
    const action = ProjectsActionsApi.removeEmployeeSuccess({project});
    const expectedState = {
      ...initialProjectState,
      project: project,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on ProjectActionsApi.removeEmployeeFailure', () =>{
    const error = <string>{};
    const action = ProjectsActionsApi.removeEmployeeFailure({error});
    const expectedState = {
      ...initialProjectState,
      error: error,
    };
    const result = ProjectFeature.reducer(initialProjectState, action);
    expect(result).toEqual(expectedState);
  });
});
