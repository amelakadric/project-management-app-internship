import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, mergeMap, of, switchMap} from 'rxjs';

import { UsersActionsApi } from '../actions/users.actions-api';
import { UsersActions } from '../actions/users.actions';
import { UserService } from '../../../services/user.service';

@Injectable()
export class UsersEffects {

  constructor(private actions$: Actions, private userService: UserService){}

  getUsers$ = createEffect(()=>
    this.actions$.pipe(
      ofType(UsersActions.loadAll),
      switchMap(()=>{
        return this.userService.getUsers().
          pipe(map(users =>
        UsersActionsApi.loadAllSuccess({users})));
      })
    )
  );

  getUser$ = createEffect(()=>
    this.actions$.pipe(
      ofType(UsersActions.load),
      switchMap(({id})=>{
       return this.userService.getUserWithId(id).
       //return this.userService.getUser().
          pipe(map(user =>
              UsersActionsApi.loadSuccess({user})));
      })
    )
  );

  getCurrentUser$ = createEffect(()=>
    this.actions$.pipe(
      ofType(UsersActions.loadCurrent),
      exhaustMap(()=>{
        return this.userService.getCurrentUser().
          //return this.userService.getUser().
          pipe(map(user =>
              UsersActionsApi.loadCurrentSuccess({user})));
      })
    )
  );


  createUser$ = createEffect(()=> {
      return this.actions$.pipe(
        ofType(UsersActions.create),
        concatMap(({user}) => {
          return this.userService.createUser(user).
           //return this.userService.getUser().
            pipe(map(user =>
          UsersActionsApi.createSuccess({user})));
        })
      );
    }
  );

  login$ = createEffect(()=> {
      return this.actions$.pipe(
        ofType(UsersActions.login),
        exhaustMap((action) => {
          return this.userService.login(action.email, action.password).
          pipe(map(role =>
              UsersActionsApi.loginSuccess({role}))
          );
        })
      );
    }
  );

  logout$ = createEffect(()=> {
      return this.actions$.pipe(
        ofType(UsersActions.logout),
        exhaustMap((action) => {
          return this.userService.logout().
          //return this.userService.getUser().
          pipe(map(message =>
              UsersActionsApi.logoutSuccess({message})));
        })
      );
    }
  );

  updateUser$ = createEffect(()=>
    this.actions$.pipe(
      ofType(UsersActions.update),
      mergeMap(({user}) => {
        return this.userService.updateUser(user).
        // return this.userService.getUser().
        pipe(map(user =>
            UsersActionsApi.updateSuccess({user})));
      })
    )
  );

  removeUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.remove),
      mergeMap(({ id }) =>
        this.userService.removeUser(id).pipe(
          switchMap(() => [
            UsersActionsApi.removeSuccess({ isDeleted: true }),
            UsersActions.loadAll()
          ])
        )
      )
    )
  );


}
