import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { directory } from 'app/models/directory.model';
import { Geolocation } from '@capacitor/geolocation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { NgIf, NgFor, NgClass, NgTemplateOutlet, DatePipe, NgStyle, NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { DirectoryItemComponent } from 'app/layout/common/directory-item/directory-item.component';
import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';
import { MatMenuModule } from '@angular/material/menu';
import { EllipsisPipe } from 'app/pipes/elipsis.pipe';
import { Subscription } from 'rxjs';

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25000,
  maximumAge: 0
};

@Component({
  selector: 'directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
    imports: [MatButtonModule, DirectoryItemComponent, EllipsisPipe, MatMenuModule, MatCardModule, NgIf, MatIconModule, MatTooltipModule, NgFor, NgForOf, NgStyle, NgClass, NgTemplateOutlet, RouterLink, DatePipe],
})
export class DirectoryComponent implements OnInit, OnDestroy {
  @Input() directoryItems!: directory[];
  loading = false;
  timestamp: number = 0;
    subscription!: Subscription;
    imagesFolder = environment.apiImage;

  constructor(
    private dialog: MatDialog) {
    this.timestamp = new Date().getTime();
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {

  }

  navigateExternal(event: Event, url: string) {
    event.preventDefault();
    if (Capacitor.isNativePlatform()) {
      Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  }

  getAddressSubstring(str: string, char: string) {
    let arr = str ? (str.split(char) ? str.split(char) : '') : '';
    return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
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

  viewImage(avatar: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      avatar: avatar
    }

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.ariaLabel = 'fffff';

    this.dialog.open(DialogImageComponent,
      dialogConfig);
  }
}
