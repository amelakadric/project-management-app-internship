import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UsersFeature } from '../../../user/store/reducer/user.reducer';
import { AppStateInterface } from '../../../types/app-state-interface';
import { ProjectsActions } from '../../store/actions/projects.actions';
import { UserModel } from '../../../models/user.model';
import { ProjectFeature } from '../../store/reducer/project.reducer';
import { UsersActions } from '../../../user/store/actions/users.actions';
import { ProjectType } from '../../../types/project.type';
import { ProjectModel } from '../../../models/project.model';

@Component({
  selector: 'app-update-project-page',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './update-project-page.component.html',
  styleUrl: './update-project-page.component.scss'
})
export class UpdateProjectPageComponent implements OnInit{

  public id!: number;
  public selectedOption: any;
  public users!: UserModel[];
  public project: ProjectModel;
  subscriptions: Array<Subscription> = [];
  public projectForm;
  public project$: Observable<ProjectType> = this.store.pipe(select(ProjectFeature.selectProject));
  public employeesInProject$: Observable<UserModel[]> = this.store.pipe(select(ProjectFeature.selectUsersArray));
  public employees$: Observable<UserModel[]> = this.store.pipe(select(UsersFeature.selectEmployeesArray));
  public managers$: Observable<UserModel[]> = this.store.pipe(select(UsersFeature.selectManagersArray));

  public constructor(private route: ActivatedRoute, private store: Store<AppStateInterface>, private router: Router){}

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('projectId') != null) {
      this.id = parseInt(<string>this.route.snapshot.paramMap.get('projectId'), 10);
      this.store.dispatch(ProjectsActions.load({id: this.id}));
      this.store.dispatch(UsersActions.loadAll());

      this.subscriptions.push(this.project$.subscribe((project) => {
        this.users = project.employees;
        this.project = project;

        this.projectForm = new FormGroup({
          title: new FormControl(this.project.name, Validators.required),
          manager: new FormControl(this.project.manager.id, Validators.required),
          employees: new FormControl('', Validators.required)
        })
      }))
    }
  }

  public onChange(projectId: number, employees: UserModel[]){
    if(this.selectedOption){
      if(!this.users.includes(this.selectedOption)){
        let newEmployee = employees.find((user) => user.id === this.selectedOption)
        this.users = [...this.users, newEmployee];
        this.store.dispatch(ProjectsActions.addEmployee({projectId: projectId, employeeId: this.selectedOption}));
      }
    }
  }

  public removeEmployee(projectId: number, user:UserModel){
    this.store.dispatch(ProjectsActions.removeEmployee({projectId: projectId, employeeId: user.id}));
    const newArray = this.users.filter((userModel: UserModel): boolean => userModel != user);
    this.users = newArray;
  }

  changeManager(projectId: number){
    let managerId: number = parseInt(<string>this.projectForm.value.manager, 10);
    this.store.dispatch(ProjectsActions.updateManager({projectId, managerId}));
  }

  public updateProject(projectId: number){
    let name: string = this.projectForm.value.title as string;
    this.store.dispatch(ProjectsActions.updateName({projectId:projectId, name: name}));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
