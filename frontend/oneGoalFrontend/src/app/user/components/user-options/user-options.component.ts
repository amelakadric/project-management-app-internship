import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { NgIf } from '@angular/common';

import { Operations } from '../../../enums/operations.enum';

@Component({
  selector: 'app-user-options',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.scss'
})
export class UserOptionsComponent {

  public showDropdown = false;

  @Output() action = new EventEmitter<Operations>();

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

  protected readonly Operations = Operations;
}
