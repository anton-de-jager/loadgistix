import { Component, EventEmitter, OnInit, AfterViewInit, Inject, HostListener } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-directory-detail',
  templateUrl: './dialog-directory-detail.component.html',
  styleUrls: ['./dialog-directory-detail.component.scss']
})
export class DialogDirectoryDetailComponent implements OnInit {
  imagesFolder = environment.api + 'Images/';
  directoryItem: any;
  screenSize: number = window.innerWidth;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDirectoryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.directoryItem = data.directoryItem
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
      this.screenSize = window.innerWidth;
  }

  getAddressSubstring(str: string, char: string) {
    let arr = str.split(char);
    return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
  }

  timestamp(){
      return new Date().getTime();
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
