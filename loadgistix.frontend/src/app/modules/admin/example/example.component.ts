import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, DecimalPipe, NgFor } from '@angular/common';
import { Component, OnDestroy, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VariableService } from 'app/services/variable.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'example',
    standalone   : true,
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, MatTooltipModule, NgFor, DecimalPipe, ScrollingModule],
})
export class ExampleComponent implements OnInit, OnDestroy {
    public token = '';

    private _unsubscribeAll = new Subject<void>();
    showAdverts: boolean;
    showAdvertsSpacing: boolean;
    /**
     * Constructor
     */
    constructor(
        private variableService: VariableService
        )
    {
    }
    ngOnInit(): void {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });

        this.variableService.showAdvertsSpacing$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdvertsSpacing) => {
                this.showAdvertsSpacing = showAdvertsSpacing;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
