import { Component, EventEmitter, OnInit, AfterViewInit, Inject, HostListener, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'environments/environment';
import { directory } from 'app/models/directory.model';
import { CommonModule, NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SortPipe } from 'app/pipes/sort.pipe';
import { DirectoryItemComponent } from 'app/layout/common/directory-item/directory-item.component';

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25000,
  maximumAge: 0
};

@Component({
  selector: 'app-directory-detail',
  templateUrl: './dialog-directory-detail.component.html',
  styleUrls: ['./dialog-directory-detail.component.scss'],
  standalone: true,
  imports: [MatIconModule, DirectoryItemComponent, MatSnackBarModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, CommonModule, NgClass, NgFor, NgForOf, NgIf, SortPipe],
  encapsulation: ViewEncapsulation.None
})
export class DialogDirectoryDetailComponent implements OnDestroy, OnInit {
  timestamp: number = 0;
  directoryItem: any;
    screenSize: number = window.innerWidth;
    imagesFolder = environment.apiImage;

  constructor(

    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDirectoryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.timestamp = new Date().getTime();
    this.directoryItem = data.directoryItem
  }
  ngOnDestroy(): void {
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenSize = window.innerWidth;
  }

  getAddressSubstring(str: string, char: string) {
    let arr = str ? (str.split(char) ? str.split(char) : '') : '';
    return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  navigateExternal(event: Event, url: string) {
    event.preventDefault();
    if (Capacitor.isNativePlatform()) {
      Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  }

  async viewLocation(item: directory) {
    if (Capacitor.getPlatform() !== 'web') {
      const geolocationEnabled = await Geolocation.checkPermissions();

      if (geolocationEnabled.location !== 'granted') {
        const granted = await Geolocation.requestPermissions();

        if (granted.location !== 'granted') {
          return;
        }
      }
    }
    Geolocation.getCurrentPosition(options).then(res => {
      let url = 'https://www.google.com/maps/dir/' + res.coords.latitude + ',' + res.coords.longitude + '/' + item.addressLat + ',' + item.addressLon + '/data=!3m1!4b1!4m2!4m1!3e0';
      Browser.open({ url });
    });
  }
}
