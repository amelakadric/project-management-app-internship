import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

import { Operations } from '../../../enums/operations.enum';
import { Roles } from '../../../enums/roles.enum';

@Component({
  selector: 'app-project-options',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './project-options.component.html',
  styleUrl: './project-options.component.scss'
})
export class ProjectOptionsComponent {

  protected readonly Roles = Roles;
  protected readonly Operations = Operations;

  @Input() role!: Roles;

  @Output() action = new EventEmitter<Operations>();

  public showDropdown = false;

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event) {
    if (!this.showDropdown) {
      return;
    }
    const target = event.target as HTMLElement;
    if (!target.closest('#div-options')) {
      this.toggleDropdown();
    }
  }

  public toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  public handleAction(actionMessage: Operations){
    this.action.emit(actionMessage);
  }

}
