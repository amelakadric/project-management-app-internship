import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserModel } from '../../../models/user.model';
import { Priorities } from '../../../enums/priorities.enum';
import { Types } from '../../../enums/type.enum';
import { AppStateInterface } from '../../../types/app-state-interface';
import { TicketModel } from '../../../models/ticket.model';
import { ProjectModel } from '../../../models/project.model';
import { Statuses } from '../../../enums/statuses.enum';
import { ProjectsActions } from '../../../project/store/actions/projects.actions';
import { ProjectFeature } from '../../../project/store/reducer/project.reducer';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessagePopUpComponent } from '../../../message-pop-up/message-pop-up.component';

@Component({
  selector: 'app-create-ticket-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './create-ticket-page.component.html',
  styleUrl: './create-ticket-page.component.scss'
})
export class CreateTicketPageComponent implements OnInit{

  protected readonly Types = Types;
  protected readonly Object = Object;
  protected readonly Priorities = Priorities;
  public projectId!: number;
  public priority=['low', 'medium', 'high'];
  public types = Object.values(Types);
  public priorities = Object.values(Priorities);
  public employees: UserModel[];
  subscriptions: Array<Subscription> = [];
  public project$: Observable<ProjectModel> = this.store.pipe(select(ProjectFeature.selectProject));

  public constructor(private store: Store<AppStateInterface>, private route: ActivatedRoute, private location: Location, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('projectId') != null) {
      this.projectId = parseInt(<string>this.route.snapshot.paramMap.get('projectId'), 10);
      this.store.dispatch(ProjectsActions.load({id: this.projectId}));
      this.subscriptions.push(this.store.select(ProjectFeature.selectProject).subscribe((project) => {
        this.employees = project.employees
      }))
    }
  }


  public createTicketForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    assignedTo: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    priority: new FormControl('', Validators.required)
  });

  public createTicket(employees: UserModel[], project: ProjectModel){
    if(this.createTicketForm.valid) {
      const userId = parseInt(<string>this.createTicketForm.value.assignedTo);
      console.log('userId', userId);
      let user: UserModel = employees.find((userModel: UserModel) => userModel.id === userId)!;

      const ticket = new TicketModel(
        10,
        project,
        this.createTicketForm.value.title as string,
        this.createTicketForm.value.description as string,
        user,
        user,
        this.createTicketForm.value.type as Types,
        this.makeEnum(this.createTicketForm.value.priority as string),
        Statuses.TODO
      )
      this.store.dispatch(ProjectsActions.addTicket({ticket}));
      this.location.back();
    }else{
      this.openMessageDialog('All fields must be filled.');
    }
  }

  public makeEnum(priority: string){
    switch(priority){
      case 'low': return Priorities.LOW;
      case 'medium': return Priorities.MEDIUM;
      case 'high': return Priorities.HIGH;

      default: return Priorities.LOW;
    }
  }

  public openMessageDialog(message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = message;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(MessagePopUpComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
