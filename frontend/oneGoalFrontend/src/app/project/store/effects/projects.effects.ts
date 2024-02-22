import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of, switchMap } from 'rxjs';

import { ProjectService } from '../../../services/project.service';
import { ProjectsActions } from '../actions/projects.actions';
import { ProjectsActionsApi } from '../actions/projects.actions-api';
import { UsersActionsApi } from '../../../user/store/actions/users.actions-api';
import { UsersActions } from '../../../user/store/actions/users.actions';
import { TicketsActions } from '../../../ticket/store/actions/tickets.actions';

@Injectable()
export class ProjectsEffects {

  constructor(private actions$: Actions, private projectService: ProjectService){}

  getProjects$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.loadAll),
      switchMap(()=>{
        return this.projectService.getAllProjects().
        pipe(map(projects =>
            ProjectsActionsApi.loadAllSuccess({projects})));
      })
    )
  );

  getUsersProjects$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.loadUsers),
      switchMap(({id})=>{
        return this.projectService.getProjectsById(id).
        pipe(map(projects =>
            ProjectsActionsApi.loadUsersSuccess({projects})));
      })
    )
  );

  getManagersProjects$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.loadManagers),
      switchMap(({id})=>{
        return this.projectService.getProjectsByManager(id).
        pipe(map(projects =>
            ProjectsActionsApi.loadManagersSuccess({projects})));
      })
    )
  );

  getProject$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.load),
      switchMap(({id})=>{
        return this.projectService.getProject(id).
        pipe(map(project =>
            ProjectsActionsApi.loadSuccess({project: project})));
      })
    )
  );


  createProject$ = createEffect(()=> {
      return this.actions$.pipe(
        ofType(ProjectsActions.create),
        concatMap(({name, managerId, employees}) => {
          return this.projectService.createProject(name, managerId, employees).
          pipe(map(project =>
              ProjectsActionsApi.createSuccess({project})));
        })
      );
    }
  );

  updateName$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.updateName),
      mergeMap(({projectId, name}) => {
        return this.projectService.updateProjectName(projectId, name).
        pipe(map(project =>
          ProjectsActionsApi.updateNameSuccess({project})));
      })
    )
  );

  updateManager$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.updateManager),
      mergeMap(({projectId, managerId}) => {
        return this.projectService.updateManager(projectId, managerId).
        pipe(map(project =>
            ProjectsActionsApi.updateManagerSuccess({project})));
      })
    )
  );

  removeProject$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.remove),
      mergeMap(({id}) =>
        this.projectService.removeProject(id).pipe(
          switchMap(() => [
            ProjectsActionsApi.removeSuccess({isRemoved: true}),
            ProjectsActions.loadAll()
          ])
        )
      )
    )
  );

  addTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.addTicket),
      mergeMap(({ ticket }) =>
        this.projectService.addTicketToProject(ticket).pipe(
          switchMap(() => [
            ProjectsActionsApi.addTicketSuccess({ ticket }),
            TicketsActions.loadTicketsFromProject({id: ticket.project.id, options: {}})
          ])
        )
      )
    )
  );

  removeTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.removeTicket),
      mergeMap(({ projectId, ticketId }) =>
        this.projectService.removeTicketFromProject(projectId, ticketId).pipe(
          switchMap(() => [
            ProjectsActionsApi.removeTicketSuccess({ isRemoved: true }),
            TicketsActions.loadTicketsFromProject({id: projectId, options: {}})
          ])
        )
      )
    )
  );

  addEmployee$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.addEmployee),
      mergeMap(({projectId, employeeId}) => {
        return this.projectService.addEmployee(projectId, employeeId).
        pipe(map(project =>
          ProjectsActionsApi.addEmployeeSuccess({project})));
      })
    )
  );

  removeEmployee$ = createEffect(()=>
    this.actions$.pipe(
      ofType(ProjectsActions.removeEmployee),
      mergeMap(({projectId, employeeId}) => {
        return this.projectService.removeEmployee(projectId, employeeId).
        pipe(map(project =>
          ProjectsActionsApi.removeEmployeeSuccess({project})));
      })
    )
  );

}
