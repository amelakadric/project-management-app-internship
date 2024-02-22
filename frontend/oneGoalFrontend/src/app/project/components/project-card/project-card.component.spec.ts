import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { ProjectCardComponent } from './project-card.component';
import { UserModel } from '../../../models/user.model';
import { Genders } from '../../../enums/genders.enum';
import { Roles } from '../../../enums/roles.enum';
import { ProjectModel } from '../../../models/project.model';
import { Operations } from '../../../enums/operations.enum';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent, RouterModule.forRoot([]),]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;

    component.project = {
      id: 1,
      name: 'new project',
      manager: new UserModel(1, "Name", "Surname", "+381654363536", Genders.MALE, "email@gmail.com", "password123", Roles.EMPLOYEE),
      employees: [],
      tickets: []
    } as ProjectModel;

    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to update-project route on UPDATE operation', () => {
    spyOn(component.router, 'navigate');
    component.responseToAction(Operations.UPDATE);
    expect(component.router.navigate).toHaveBeenCalledWith(['update-project/1']);
  });

  it('navigates to create-ticket route on ADD operation', () => {
    spyOn(component.router, 'navigate');
    component.responseToAction(Operations.ADD);
    expect(component.router.navigate).toHaveBeenCalledWith(['create-ticket/1']);
  })

  it('emits delete event on DELETE operation', () => {
    spyOn(component.delete, 'emit');
    component.responseToAction(Operations.DELETE);
    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });

});
