import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { UsersActionsApi } from '../actions/users.actions-api';
import { UsersActions } from '../actions/users.actions';
import { initialUserState, UsersFeature } from './user.reducer';
import { UserType } from '../../../types/user.type';
import { Roles } from '../../../enums/roles.enum';

describe('UsersReducer', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: { users: initialUserState } })],
    });

    store = TestBed.inject(MockStore);
  });

  it('sets isLoading to true on UsersActions.loadAll', () => {
    const action = UsersActions.loadAll();
    const expectedState = {
      ...initialUserState,
      isLoading: true,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on UsersActionsApi.loadAllFailure', () =>{
    const error = <string>{};
    const action = UsersActionsApi.loadAllFailure({error});
    const expectedState = {
      ...initialUserState,
      error: error,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on UsersActions.load', () => {
    const id = <number>{};
    const action = UsersActions.load({id});
    const expectedState = {
      ...initialUserState,
      isLoading: true,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads user in user on UsersActionsApi.loadSuccess', () => {
    const user = <UserType>{};
    const action = UsersActionsApi.loadSuccess({user});
    const expectedState = {
      ...initialUserState,
      user: user,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on UsersActionsApi.loadFailure', () =>{
    const error = <string>{};
    const action = UsersActionsApi.loadFailure({error});
    const expectedState = {
      ...initialUserState,
      error: error,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on UsersActions.loadCurrent', () => {
    const action = UsersActions.loadCurrent();
    const expectedState = {
      ...initialUserState,
      isLoading: true,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on UsersActionsApi.loadCurrentFailure', () =>{
    const error = <string>{};
    const action = UsersActionsApi.loadCurrentFailure({error});
    const expectedState = {
      ...initialUserState,
      error: error,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on UsersActions.create', () => {
    const user = <UserType>{};
    const action = UsersActions.create({user});
    const expectedState = {
      ...initialUserState,
      isLoading: true,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads user in user on UsersActionsApi.createSuccess', () => {
    const user = <UserType>{};
    const action = UsersActionsApi.createSuccess({user});
    const expectedState = {
      ...initialUserState,
      isLoading: false,
      usersArray: [...initialUserState.usersArray, user],
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on UsersActionsApi.createFailure', () =>{
    const error = <string>{};
    const action = UsersActionsApi.createFailure({error});
    const expectedState = {
      ...initialUserState,
      isLoading: false,
      error: error,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on UsersActions.login', () => {
    const email = <string>{};
    const password = <string>{};
    const action = UsersActions.login({email, password});
    const expectedState = {
      ...initialUserState,
      isLoading: true,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads role in currentUserRole on UsersActionsApi.loginSuccess', () => {
    const role = <Roles>{};
    const action = UsersActionsApi.loginSuccess({role});
    const expectedState = {
      ...initialUserState,
      currentUserRole: role,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on UsersActionsApi.loginFailure', () =>{
    const error = <string>{};
    const action = UsersActionsApi.loginFailure({error});
    const expectedState = {
      ...initialUserState,
      error: error,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on UsersActions.logout', () => {
    const action = UsersActions.logout();
    const expectedState = {
      ...initialUserState,
      isLoading: true,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets user, currentUser and currentUserRole to null on UsersActionsApi.logoutSuccess', () => {
    const message = <Roles>{};
    const action = UsersActionsApi.logoutSuccess({message});
    const expectedState = {
      ...initialUserState,
      user: null,
      currentUserRole: null,
      currentUser: null
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on UsersActions.remove', () => {
    const id = <number>{};
    const action = UsersActions.remove({id});
    const expectedState = {
      ...initialUserState,
      isLoading: true,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to false on UsersActionsApi.removeSuccess', () => {
    const isDeleted = <boolean>{};
    const action = UsersActionsApi.removeSuccess({isDeleted});
    const expectedState = {
      ...initialUserState,
      isLoading: false
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on UsersActionsApi.removeFailure', () =>{
    const error = <string>{};
    const action = UsersActionsApi.removeFailure({error});
    const expectedState = {
      ...initialUserState,
      isLoading: false,
      error: error,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('sets isLoading to true on UsersActions.update', () => {
    const user = <UserType>{};
    const action = UsersActions.update({user});
    const expectedState = {
      ...initialUserState,
      isLoading: true,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

  it('loads error in error on UsersActionsApi.updateFailure', () =>{
    const error = <string>{};
    const action = UsersActionsApi.updateFailure({error});
    const expectedState = {
      ...initialUserState,
      error: error,
    };
    const result = UsersFeature.reducer(initialUserState, action);
    expect(result).toEqual(expectedState);
  });

});
