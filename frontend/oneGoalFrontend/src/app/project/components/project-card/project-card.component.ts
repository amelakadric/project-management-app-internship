import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { ProjectModel } from '../../../models/project.model';
import { ProjectOptionsComponent } from '../project-options/project-options.component';
import { Operations } from '../../../enums/operations.enum';
import { Roles } from '../../../enums/roles.enum';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [ProjectOptionsComponent, RouterLink, NgIf],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {

  @Input() project!: ProjectModel;
  @Input() role!: Roles;
  @Output() delete = new EventEmitter<number>;

  public constructor(public router: Router) {}

  public responseToAction(event: Operations){
    if( event === Operations.UPDATE ){
      this.router.navigate(['update-project/' + this.project.id.toString()]);
    }else if( event === Operations.DELETE ){
      this.delete.emit(this.project.id);
    } else if(event === Operations.ADD){
      this.router.navigate(['create-ticket/'+ this.project.id.toString()]);
    }
  }
}
