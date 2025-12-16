import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
import { appConfig } from 'app/app.config';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { environment } from 'environments/environment';
import { enableProdMode } from '@angular/core';
import 'hammerjs';

bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.error(err));

defineCustomElements(window);

if (environment.production) {
    enableProdMode();
}

