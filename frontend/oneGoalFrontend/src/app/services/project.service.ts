import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { catchError, map, of, throwError } from 'rxjs';

import { ProjectModel } from '../models/project.model';
import { TicketModel } from '../models/ticket.model';
import { environment } from '../../environment/environment';
import { MessagePopUpComponent } from '../message-pop-up/message-pop-up.component';
import { TicketService } from './ticket.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl = environment.backendServerUrl + '/projects';

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {
  }

  createProject(name: string, managerId: number, employees: number[]){
    return this.http.post(this.baseUrl, {name, managerId, employees}, {withCredentials: true}).pipe(
      map((data: { project: ProjectModel }) => {
        this.router.navigate(['projects']);
        return data.project
      }),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
  }

  getAllProjects(){
    return this.http.get(this.baseUrl, {withCredentials: true}).pipe(
      map((data: { projects: ProjectModel[] }) => data.projects),
      catchError((error) => throwError(() => error))
    );
  }

  getProjectsById(id: number){
    return this.http.get(environment.backendServerUrl + '/users/' + id + '/employments', {withCredentials: true}).pipe(
      map((data: { projects: ProjectModel[] }) => data.projects),
      catchError((error) => throwError(() => error))
    );
  }

  getProject(id: number){
    return this.http.get(this.baseUrl + '/' + id, {withCredentials: true}).pipe(
      map((data: { project: ProjectModel }) => data.project),
      catchError((error) => throwError(() => error))
    );
  }

  removeProject(projectId: number){
    return this.http.delete(this.baseUrl + '/' + projectId, {withCredentials: true}).pipe(
      map((data: { isDeleted: boolean }) => data.isDeleted),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
 }

  updateProjectName(projectId: number, name: string){
    return this.http.patch(this.baseUrl + '/' + projectId + '/name', {name: name}, {withCredentials: true}).pipe(
      map((data: { project: ProjectModel }) => {
        this.router.navigate(['projects']);
        return data.project
      }),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
  }

  updateManager(projectId: number, managerId: number){
    return this.http.patch(this.baseUrl + '/' + projectId + '/manager/' + managerId, {withCredentials: true}).pipe(
        map((data: { project: ProjectModel }) => {
          return data.project
        }),
        catchError((data) => {
          this.openMessageDialog(data.error.message);
          return of(undefined);
        })
      );
  }

  addEmployee(projectId: number, employeeId: number){
    return this.http.post(this.baseUrl + '/' + projectId + '/employees/' + employeeId, {},{withCredentials: true}).pipe(
      map((data: { project: ProjectModel }) => {
        return data.project
      }),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
  }

  removeEmployee(projectId: number, employeeId: number){
    return this.http.delete(this.baseUrl + '/' + projectId + '/employees/' + employeeId, {withCredentials: true}).pipe(
      map((data: { project: ProjectModel }) => {
        return data.project
      }),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
  }

  addTicketToProject(ticket: TicketModel){
    return this.http.post(this.baseUrl + '/' + ticket.project.id + '/tickets',
      {title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      assignedTo: ticket.assignedTo.id,
      type: ticket.type,
      priority: ticket.priority}, {withCredentials: true}).pipe(
      map((data: { ticket: TicketModel }) => {
        //TicketService
        return data.ticket;
      }),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
}

  removeTicketFromProject(projectId: number, ticketId:number){
    return this.http.delete(this.baseUrl + '/' + projectId + '/tickets/' + ticketId, {withCredentials: true}).pipe(
      map((data: { isDeleted: boolean }) => data.isDeleted),
      catchError((data) => {
        this.openMessageDialog(data.error.message);
        return of(undefined);
      })
    );
  }

  getProjectsByManager(managerId: number){
    return this.http.get(environment.backendServerUrl + '/users/' + managerId + '/managed-projects', {withCredentials: true}).pipe(
      map((data: { projects: ProjectModel[] }) => data.projects),
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
