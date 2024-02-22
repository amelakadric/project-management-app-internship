import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { catchError, map, Observable, of, throwError } from 'rxjs';

import { UserModel } from '../models/user.model';
import { Roles } from '../enums/roles.enum';
import { environment } from '../../environment/environment';
import { MessagePopUpComponent } from '../message-pop-up/message-pop-up.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.backendServerUrl + '/users';

  baseAuthUrl = environment.backendServerUrl + '/auth';

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {
  }

  public createUser(user: UserModel){
    return this.http.post(this.baseUrl, user).pipe(
      map((user: UserModel) => { this.router.navigate(['login']); return user}),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
      );
  }

  public login(email: string, password: string){
    return this.http.post(this.baseAuthUrl + '/login', {email: email, password: password}, {withCredentials: true}).pipe(
      map((data: {id: number, email: string, role: Roles}) => { this.router.navigate(['projects']); return data.role}),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
  }

  public logout(){
    return this.http.get(this.baseAuthUrl + '/logout', {withCredentials: true}).pipe(
      map((message: string) => {
        this.router.navigate(['login'])
        return message;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  public getUserWithId(id: number){
    return this.http.get(this.baseUrl + '/' + id, {withCredentials: true}).pipe(
      map((data:{user: UserModel}) => data.user),
      catchError((error) => throwError(() => error))
    );
  }

  public getUsers(): Observable<UserModel[]>{
    return this.http.get(this.baseUrl, {withCredentials: true}).pipe(
      map((data: {users: UserModel[] }) => data.users),
      catchError((error) => throwError(() => error))
    );
  }

  public updateUser(user: UserModel){
    return this.http.patch(this.baseUrl + "/" + user.id, user, {withCredentials: true}).pipe(
      map((data: UserModel) => {this.router.navigate(['users']); return data}),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
  }

  public removeUser(id: number){
    return this.http.delete(this.baseUrl + '/' + id, {withCredentials: true}).pipe(
      map((data:{isDeleted: boolean}) => data.isDeleted),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
  }

  public getCurrentUser(){
    return this.http.get(this.baseUrl + '/me', {withCredentials: true}).pipe(
      map((data: { user: UserModel } ) => data.user),
      catchError((error) => throwError(() => error))
    );
  }

  public openMessageDialog(message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = message;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(MessagePopUpComponent, dialogConfig);
  }
}
