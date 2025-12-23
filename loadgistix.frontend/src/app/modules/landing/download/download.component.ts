import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-download',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss']
})
export class DownloadComponent {
    
    isIOS(): boolean {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    isAndroid(): boolean {
        return /Android/.test(navigator.userAgent);
    }

    downloadAPK(): void {
        window.location.href = '/loadgistix.apk';
    }

    installPWA(): void {
        // Trigger the browser's install prompt
        const deferredPrompt = (window as any).deferredPrompt;
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                (window as any).deferredPrompt = null;
            });
        } else {
            // Fallback: show instructions
            alert('To install: tap the Share button in your browser, then "Add to Home Screen"');
        }
    }
}

