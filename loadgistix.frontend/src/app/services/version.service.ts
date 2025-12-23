import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';

export interface VersionInfo {
    version: string;
    buildTime: string;
    commitHash: string;
}

@Injectable({
    providedIn: 'root'
})
export class VersionService {
    private readonly VERSION_STORAGE_KEY = 'loadgistix_version';
    private readonly CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
    private currentVersion: VersionInfo | null = null;

    constructor(private http: HttpClient) {}

    /**
     * Initialize version checking
     */
    async init(): Promise<void> {
        // Check version on startup
        await this.checkVersion();

        // Set up periodic checks (only on web)
        if (Capacitor.getPlatform() === 'web') {
            setInterval(() => this.checkVersion(), this.CHECK_INTERVAL);
            
            // Also check when tab becomes visible
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    this.checkVersion();
                }
            });
        }
    }

    /**
     * Check for new version
     */
    async checkVersion(): Promise<boolean> {
        try {
            // Fetch version.json with cache-busting
            const timestamp = new Date().getTime();
            const versionInfo = await this.http.get<VersionInfo>(
                `/assets/version.json?t=${timestamp}`
            ).toPromise();

            if (!versionInfo) {
                return false;
            }

            const storedVersion = this.getStoredVersion();
            this.currentVersion = versionInfo;

            // First time - just store the version
            if (!storedVersion) {
                this.storeVersion(versionInfo);
                console.log('Version initialized:', versionInfo.version);
                return false;
            }

            // Compare versions
            if (storedVersion.version !== versionInfo.version || 
                storedVersion.buildTime !== versionInfo.buildTime) {
                console.log('New version detected!', {
                    old: storedVersion.version,
                    new: versionInfo.version
                });

                if (Capacitor.getPlatform() === 'web') {
                    // Web: Clear cache and reload
                    await this.clearCacheAndReload(versionInfo);
                } else {
                    // Mobile: Show update notification
                    await this.showUpdateNotification(versionInfo);
                }
                return true;
            }

            return false;
        } catch (error) {
            console.warn('Version check failed:', error);
            return false;
        }
    }

    /**
     * Clear browser cache and reload
     */
    private async clearCacheAndReload(newVersion: VersionInfo): Promise<void> {
        // Store new version before reload
        this.storeVersion(newVersion);

        // Clear service worker caches
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
                console.log('Caches cleared');
            } catch (error) {
                console.warn('Failed to clear caches:', error);
            }
        }

        // Unregister service workers
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(
                    registrations.map(reg => reg.unregister())
                );
                console.log('Service workers unregistered');
            } catch (error) {
                console.warn('Failed to unregister service workers:', error);
            }
        }

        // Force reload (bypass cache)
        window.location.reload();
    }

    /**
     * Show update notification on mobile
     */
    private async showUpdateNotification(newVersion: VersionInfo): Promise<void> {
        try {
            // Request notification permission
            const permResult = await LocalNotifications.requestPermissions();
            
            if (permResult.display === 'granted') {
                await LocalNotifications.schedule({
                    notifications: [
                        {
                            id: 1001,
                            title: 'Loadgistix Update Available',
                            body: `Version ${newVersion.version} is available. Tap to update.`,
                            largeBody: `A new version of Loadgistix (${newVersion.version}) is available. Update now to get the latest features and improvements.`,
                            actionTypeId: 'UPDATE_ACTION',
                            extra: {
                                action: 'update',
                                version: newVersion.version
                            }
                        }
                    ]
                });

                // Listen for notification action
                LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
                    if (action.notification.extra?.action === 'update') {
                        this.openAppStore();
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to show update notification:', error);
            // Fallback: Show in-app alert
            this.showInAppUpdateAlert(newVersion);
        }
    }

    /**
     * Show in-app update alert (fallback for mobile)
     */
    private showInAppUpdateAlert(newVersion: VersionInfo): void {
        // Dispatch custom event that components can listen to
        const event = new CustomEvent('app-update-available', {
            detail: {
                version: newVersion.version,
                buildTime: newVersion.buildTime
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Open app store or download page
     */
    async openAppStore(): Promise<void> {
        // Since we're not on Play Store, open our download page
        window.open('https://loadgistix.com/download', '_system');
    }

    /**
     * Get app version for mobile
     */
    async getAppVersion(): Promise<string> {
        if (Capacitor.getPlatform() !== 'web') {
            try {
                const info = await App.getInfo();
                return info.version;
            } catch {
                return 'unknown';
            }
        }
        return this.currentVersion?.version || 'unknown';
    }

    /**
     * Store version in localStorage
     */
    private storeVersion(version: VersionInfo): void {
        try {
            localStorage.setItem(this.VERSION_STORAGE_KEY, JSON.stringify(version));
        } catch (error) {
            console.warn('Failed to store version:', error);
        }
    }

    /**
     * Get stored version from localStorage
     */
    private getStoredVersion(): VersionInfo | null {
        try {
            const stored = localStorage.getItem(this.VERSION_STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    /**
     * Get current version info
     */
    getCurrentVersion(): VersionInfo | null {
        return this.currentVersion;
    }
}

