import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
import { appConfig } from 'app/app.config';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { environment } from 'environments/environment';
import { enableProdMode, isDevMode } from '@angular/core';
import 'hammerjs';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.error(err));

defineCustomElements(window);

// Register Service Worker for PWA
if ('serviceWorker' in navigator && !isDevMode()) {
    navigator.serviceWorker.register('/ngsw-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(err => {
            console.log('Service Worker registration failed:', err);
        });
}

