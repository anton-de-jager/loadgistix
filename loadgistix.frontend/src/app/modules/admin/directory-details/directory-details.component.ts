import { Component, OnDestroy, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Guid } from 'guid-typescript';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { VariableService } from 'app/services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { directory } from 'app/models/directory.model';
import { DialogDirectoryDetailComponent } from 'app/dialogs/dialog-directory-detail/dialog-directory-detail.component';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';
import { environment } from 'environments/environment';
import { Preferences } from '@capacitor/preferences';
import { CommonModule, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SqlService } from 'app/services/sql.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

export interface Section {
    name: string;
    count: number;
}

@Component({
    selector: 'directory-details',
    templateUrl: './directory-details.component.html',
    styleUrls: ['./directory-details.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, NgClass, MatTableModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class DirectoryDetailsComponent implements OnInit, OnDestroy {
    timestamp: number = 0;

    private _unsubscribeAll = new Subject<void>();
    loading: boolean = true;

    count: number = 0;
    scrollIndex = 0;
    imagesFolder = environment.apiImage;
    directoryItems: directory[] = [];
    screenSize: number = window.innerWidth;
    directoryCategoryDescription: string = '';
    native: string = '';
    id: Guid | null = null;
    currentUser: User | null = null;

    constructor(
        private sqlService: SqlService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        public userService: UserService,
        private _router: Router
    ) {
        this.timestamp = new Date().getTime();
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.loading = false;

        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
            }
        });
    }

    ngOnInit(): void {
        Preferences.get({ key: 'directoryCategoryId' }).then(id => {
            this.id = Guid.parse(id.value!);
            if (this.id) {
                this.count = 0;
                this.scrollIndex = 0;
                this.getDirectories().then(getDirectoriesResult => {
                    this.loading = false;

                    this.count = getDirectoriesResult.length > 0 ? getDirectoriesResult[0].count : 0;
                    if (getDirectoriesResult.length > 0) {
                        this.directoryItems = getDirectoriesResult;
                        this.directoryCategoryDescription = this.directoryItems[0].directoryCategoryDescription;
                    } else {
                        this._router.navigate(['business-directory']);
                    }
                });
            }
        });
    }

    onScrollDown(ev: any) {
        if (!this.loading && this.scrollIndex + 10 < this.count) {
            this.loading = true;

            this.scrollIndex += 10;
            this.getDirectories().then(getDirectoriesResult => {
                this.directoryItems = this.directoryItems.concat(getDirectoriesResult);
                this.count = this.directoryItems.length > 0 ? this.directoryItems[0].count : 0;
                this.loading = false;

            });
        }
    }


    getDirectories(): Promise<directory[]> {
        var promise = new Promise<directory[]>((resolve) => {
            try {
                this.sqlService.getItemsTags('directories', 'category', this.id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.data == "Unauthorised") {
                            this._router.navigate(['/sign-out']);
                        } else {
                            if (apiResult.result == true) {
                                resolve(apiResult.data);
                            }
                        }
                    },
                    error: (error) => {
                        console.log('error', error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    copyToClipboard(str: any) {
        Clipboard.write({
            string: str
        });
        Toast.show({
            text: 'Copied Successfully'
        });
    }

    showItem(item: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            directoryItem: item
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(DialogDirectoryDetailComponent,
            dialogConfig);
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    navigateExternal(event: Event, url: string) {
        event.preventDefault();
        if (Capacitor.isNativePlatform()) {
            Browser.open({ url });
        } else {
            window.open(url, '_blank');
        }
    }

    back() {
        this._router.navigate(['business-directory']);
    }
}
