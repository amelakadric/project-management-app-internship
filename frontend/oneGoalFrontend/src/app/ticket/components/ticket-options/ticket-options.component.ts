import { Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';

import { Operations } from '../../../enums/operations.enum';

@Component({
  selector: 'app-ticket-options',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './ticket-options.component.html',
  styleUrl: './ticket-options.component.scss'
})
export class TicketOptionsComponent {

  protected readonly Operations = Operations;

  @Output() action = new EventEmitter<Operations>();

  public showDropdown = false;
  @ViewChild('selectElement') selectElement: any;
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
