import { CommonModule, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { DialogVehicleCategoryComponent } from "app/dialogs/dialog-vehicleCategory/dialog-vehicleCategory.component";
import { vehicleCategory } from "app/models/vehicleCategory.model";
import { extractApiData } from "app/services/api-response.helper";
import { SqlService } from "app/services/sql.service";
import { VariableService } from "app/services/variable.service";
import { Subject, Subscription, debounceTime, fromEvent, takeUntil } from "rxjs";


@Component({
    selector: 'lookups-vehicle-category',
    templateUrl: './vehicle-category.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, ReactiveFormsModule, NgClass],
})
export class LookupsVehicleCategoryComponent implements OnInit, OnDestroy {
    loading: boolean = true;


    private _unsubscribeAll = new Subject<void>();

    vehicleCategoryList: vehicleCategory[] = [];
    displayedColumns: string[] = ['description'];
    dataSource!: MatTableDataSource<vehicleCategory>;
    form!: FormGroup;
    deleteForm!: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    rowCount: number = Math.trunc((window.innerHeight - (window.innerWidth >= 1280 ? 264 : 304)) / 40);
    private destroy$ = new Subject<void>();
    iPaginator: number = 0;

    constructor(
        private sqlService: SqlService,
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        
        private variableService: VariableService,
        private router: Router
    ) {
        variableService.setPageSelected('Lookups');
        fromEvent(window, 'resize')
            .pipe(
                debounceTime(200),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.iPaginator = 0;
                this.setPaginator();
            })
    }

    ngOnInit(): void {
        this.getVehicleCategories();
    }

    getVehicleCategories() {
        this.sqlService.getItems('vehicleCategories').pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.vehicleCategoryList = apiResult.data;
                this.dataSource = new MatTableDataSource(this.vehicleCategoryList);
                this.iPaginator = 0;
                this.setPaginator();
            }
        })
    }

    setPaginator() {
        this.iPaginator++;
        if (this.iPaginator < 5) {
            if (this.paginator) {
                this.paginator.pageSize = Math.trunc((window.innerHeight - 297) / 40);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                if (this.paginator.pageIndex != 0) {
                    if ((this.paginator.pageIndex + 1) > this.paginator.getNumberOfPages()) {
                        this.paginator.lastPage();
                    }
                }
                this.loading = false;

            } else {
                setTimeout(() => {
                    this.setPaginator();
                }, 500);
            }
        } else {
            this.loading = false;

        }
    }

    initUpsertVehicleCategory(row: any) {
        this.form = this._formBuilder.group({
            id: [row == null ? undefined : row.id ? row.id : row.id],
            description: [row == null ? null : row.description, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            vehicleCategoryList: this.vehicleCategoryList,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(DialogVehicleCategoryComponent,
            dialogConfig);


        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result !== false) {
                switch (result.action) {
                    case 'insert':
                        this.sqlService.createItem('vehicleCategories', result.value).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                            const newItem = extractApiData(apiResult.data);
                            if (newItem) {
                                this.vehicleCategoryList.push(newItem);
                                this.dataSource = new MatTableDataSource(this.vehicleCategoryList);
                                this.iPaginator = 0;
                                this.setPaginator();
                            }
                        });
                        break;
                    case 'update':
                        this.sqlService.updateItem('vehicleCategories', result.value).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                            const updatedItem = extractApiData(apiResult.data);
                            const existingItem = this.vehicleCategoryList.find(x => x.id == result.value.id);
                            if (existingItem && updatedItem) {
                                existingItem.description = updatedItem.description;
                                this.dataSource = new MatTableDataSource(this.vehicleCategoryList);
                                this.iPaginator = 0;
                                this.setPaginator();
                            }
                        });
                        break;
                    case 'delete':
                        this.vehicleCategoryList = this.vehicleCategoryList.filter(x => x.id != result.value);
                        this.dataSource = new MatTableDataSource(this.vehicleCategoryList);
                        this.iPaginator = 0;
                        this.setPaginator();
                        break;
                    default:
                        break;
                }
            }
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.paginator) {
            if (this.paginator.pageIndex != 0) {
                if ((this.paginator.pageIndex + 1) > this.paginator.getNumberOfPages()) {
                    this.paginator.lastPage();
                }
            }
        }
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
