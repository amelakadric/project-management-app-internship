import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { iif, map, Observable, of, Subscription, switchMap } from 'rxjs';

import { UserService } from '../services/user.service';
import { AppStateInterface } from '../types/app-state-interface';
import { UsersFeature } from '../user/store/reducer/user.reducer';
import { Roles } from '../enums/roles.enum';
import { UserModel } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  private route!: ActivatedRouteSnapshot;

  constructor(private userService: UserService, private router: Router, private store: Store<AppStateInterface>) {

  }

  canActivate(route: ActivatedRouteSnapshot){
    this.route = route;
    return this.checkAuth();
  }

  private checkAuth() {

    const requiredRoles = this.route.data['requiredRole'] as Array<string>;

    let userRole: Roles | null;


    return this.waitForCollectionToLoad()
      .pipe(map((user)=>{
      userRole = user.role;

        if ( requiredRoles.includes(userRole) ) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }

    })
    )

  }

  private waitForCollectionToLoad(): Observable<UserModel> {
    return this.store
      .select(UsersFeature.selectCurrentUser)
      .pipe(
        switchMap((user) =>
          iif(() => !!user, of(user), this.userService.getCurrentUser()),
        ),
      );
  }


}

