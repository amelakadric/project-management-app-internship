import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-message-pop-up',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle
    ],
  templateUrl: './message-pop-up.component.html',
  styleUrl: './message-pop-up.component.scss'
})
export class MessagePopUpComponent {

  public message!: string;
  public constructor(@Inject(MAT_DIALOG_DATA) public data: string, public dialogRef: MatDialogRef<MessagePopUpComponent>) {
    this.message = data;
  }

  public confirmed(): void {
    this.dialogRef.close(true);
  }

}
