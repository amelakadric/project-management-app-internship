import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOptionsComponent } from './project-options.component';
import { Operations } from '../../../enums/operations.enum';

describe('ProjectOptionsComponent', () => {
  let component: ProjectOptionsComponent;
  let fixture: ComponentFixture<ProjectOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('toggles dropdown', () => {
    expect(component.showDropdown).toBeFalse();
    component.toggleDropdown();
    expect(component.showDropdown).toBeTrue();
  });

  it('emits action when handleAction is called', () => {
    spyOn(component.action, 'emit');
    const testAction: Operations = Operations.UPDATE;
    component.handleAction(testAction);
    expect(component.action.emit).toHaveBeenCalledWith(testAction);
  });
});
