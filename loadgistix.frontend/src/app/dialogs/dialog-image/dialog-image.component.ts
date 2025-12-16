import { NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './dialog-image.component.html',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule, NgIf],
  encapsulation: ViewEncapsulation.None
})
export class DialogImageComponent implements OnDestroy {
  timestamp: number = 0;
  private _unsubscribeAll = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DialogImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  close(){
    this.dialogRef.close(false);
  }
}
