import { Routes } from '@angular/router';
import { QuoteViewComponent } from './quote-view.component';

export default [
    {
        path: ':id',
        component: QuoteViewComponent,
    },
] as Routes;

