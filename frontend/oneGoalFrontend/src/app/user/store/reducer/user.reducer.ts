import { createFeature, createReducer, on } from '@ngrx/store';

import { UserStateInterface } from '../../../state/user-state-interface';
import { UsersActions } from '../actions/users.actions';
import { UsersActionsApi } from '../actions/users.actions-api';
import { Roles } from '../../../enums/roles.enum';

export const initialUserState: UserStateInterface = {
  isLoading: false,
  user: null,
  usersArray: [],
  employeesArray: [],
  managersArray: [],
  error: null,
  currentUserRole: null,
  currentUser: null
};

export const UsersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialUserState,

    on(UsersActions.loadAll, (state) => ({...state, isLoading: true})),
    on(UsersActionsApi.loadAllSuccess, (state, action) => ({
      ... state,
      usersArray: action.users,
      employeesArray: action.users.filter(user => user.role === Roles.EMPLOYEE),
      managersArray: action.users.filter(user => user.role === Roles.MANAGER)
    })),
    on(UsersActionsApi.loadAllFailure, (state, action) => ({
      ... state,
      error: action.error
    })),

    on(UsersActions.load, (state) => ({...state, isLoading: true})),
    on(UsersActionsApi.loadSuccess, (state, action) => ({
      ...state,
      user: action.user
    })),
    on(UsersActionsApi.loadFailure, (state, action) => ({
      ...state
      , error: action.error
    })),

    on(UsersActions.loadCurrent, (state) => ({...state, isLoading: true})),
    on(UsersActionsApi.loadCurrentSuccess, (state, action) => ({
      ...state,
      currentUser: action.user
    })),
    on(UsersActionsApi.loadCurrentFailure, (state, action) => ({
      ...state
      , error: action.error
    })),

    on(UsersActions.create, (state) => ({
      ... state, isLoading: true
    })),
    on(UsersActionsApi.createSuccess, (state, action) => ({
      ... state,
      isLoading: false,
      usersArray: [...state.usersArray, action.user]
    })),
    on(UsersActionsApi.createFailure, (state, action) => ({
      ... state,
      isLoading: false,
      error: action.error
    })),

    on(UsersActions.login, (state) => ({...state, isLoading: true})),
    on(UsersActionsApi.loginSuccess, (state, action) => ({
      ...state,
      currentUserRole: action.role,
    })),
    on(UsersActionsApi.loginFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

    on(UsersActions.logout, (state) => ({...state, isLoading: true})),
    on(UsersActionsApi.logoutSuccess, (state, action) => ({
      ...state,
      user: null,
      currentUser: null,
      currentUserRole: null
    })),
    on(UsersActionsApi.loginFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

    on(UsersActions.remove, (state) => ({...state, isLoading: true})),
    on(UsersActionsApi.removeSuccess, (state, action) => ({
      ...state,
      isLoading: false,
    })),
    on(UsersActionsApi.removeFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error
    })),

    on(UsersActions.update, (state) => ({...state, isLoading: true})),
    on(UsersActionsApi.updateSuccess, (state, action) => ({
      ...state,
      user:action.user
    })),
    on(UsersActionsApi.updateFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

)
});

export const{
  name,
  reducer,
  selectUsersState,
  selectUser,
  selectUsersArray,
  selectEmployeesArray,
  selectManagersArray,
  selectError,
  selectCurrentUserRole,
  selectCurrentUser,
  selectIsLoading
} = UsersFeature;
