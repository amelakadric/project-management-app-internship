import { createFeature, createReducer, on } from '@ngrx/store';

import { ProjectsActions } from '../actions/projects.actions';
import { ProjectsActionsApi } from '../actions/projects.actions-api';
import { ProjectStateInterface } from '../../../state/project-state-interface';

export const initialProjectState: ProjectStateInterface = {
  isLoading: false,
  project: null,
  projectArray: [],
  error: null,
  usersArray: [],
  ticketsArray: []
};

export const ProjectFeature = createFeature({
  name: 'projects',
  reducer: createReducer(
    initialProjectState,

    on(ProjectsActions.loadAll, (state) => ({...state, isLoading:true})),
    on(ProjectsActionsApi.loadAllSuccess, (state, action) => ({
      ... state,
      projectArray: action.projects
    })),
    on(ProjectsActionsApi.loadAllFailure, (state, action) => ({
      ... state,
      error: action.error
    })),

    on(ProjectsActions.loadUsers, (state) => ({...state, isLoading:true})),
    on(ProjectsActionsApi.loadUsersSuccess, (state, action) => ({
      ... state,
      projectArray: action.projects
    })),
    on(ProjectsActionsApi.loadUsersFailure, (state, action) => ({
      ... state,
      error: action.error
    })),

    on(ProjectsActions.loadManagers, (state) => ({...state, isLoading:true})),
    on(ProjectsActionsApi.loadManagersSuccess, (state, action) => ({
      ... state,
      projectArray: action.projects
    })),
    on(ProjectsActionsApi.loadManagersFailure, (state, action) => ({
      ... state,
      error: action.error
    })),

    on(ProjectsActions.load, (state) => ({...state, isLoading: true})),
    on(ProjectsActionsApi.loadSuccess, (state, action) => ({
      ...state,
      project: action.project,
      usersArray: action.project.employees,
      ticketsArray: action.project.tickets
    })),
    on(ProjectsActionsApi.loadFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

    on(ProjectsActions.create, (state) => ({
      ... state, isLoading: true
    })),
    on(ProjectsActionsApi.createSuccess, (state, action) => ({
      ... state,
      isLoading: false,
      projectArray: [...state.projectArray, action.project]
    })),
    on(ProjectsActionsApi.createFailure, (state, action) => ({
      ... state,
      isLoading: false,
      error: action.error
    })),

    on(ProjectsActions.remove, (state) => ({...state, isLoading: true})),
    on(ProjectsActionsApi.removeSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      // projectArray: action.projects
    })),
    on(ProjectsActionsApi.removeFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error
    })),

    on(ProjectsActions.updateName, (state) => ({...state, isLoading: true})),
    on(ProjectsActionsApi.updateNameSuccess, (state, action) => ({
      ...state,
      project: action.project
    })),
    on(ProjectsActionsApi.updateNameFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

    on(ProjectsActions.updateManager, (state) => ({...state, isLoading: true})),
    on(ProjectsActionsApi.updateManagerSuccess, (state, action) => ({
      ...state,
      project: action.project
    })),
    on(ProjectsActionsApi.updateManagerFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

    on(ProjectsActions.addEmployee, (state) => ({...state, isLoading: true})),
    on(ProjectsActionsApi.addEmployeeSuccess, (state, action) => ({
      ...state,
      project: action.project
    })),
    on(ProjectsActionsApi.addEmployeeFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

    on(ProjectsActions.removeEmployee, (state) => ({...state, isLoading: true})),
    on(ProjectsActionsApi.removeEmployeeSuccess, (state, action) => ({
      ...state,
      project: action.project
    })),
    on(ProjectsActionsApi.removeEmployeeFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

    on(ProjectsActions.addTicket, (state) => ({...state, isLoading: true})),
    on(ProjectsActionsApi.addTicketSuccess, (state, action) => ({
      ...state,
      // project: action.ticket
    })),
    on(ProjectsActionsApi.addTicketFailure, (state, action) => ({
      ...state,
      error: action.error
    })),

    on(ProjectsActions.removeTicket, (state) => ({...state, isLoading: true})),
    on(ProjectsActionsApi.removeTicketSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      // project: action.project
    })),
    on(ProjectsActionsApi.removeTicketFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error
    })),
  )
});

export const{
  name,
  reducer,
  selectProjectsState,
  selectProject,
  selectProjectArray,
  selectUsersArray,
  selectIsLoading,
  selectError
} = ProjectFeature;
