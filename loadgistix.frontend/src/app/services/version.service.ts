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
    private readonly SERVER_URL = 'https://loadgistix.com';
    private currentVersion: VersionInfo | null = null;
    private initialized = false;

    constructor(private http: HttpClient) {}

    /**
     * Initialize version checking
     */
    async init(): Promise<void> {
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        // Delay version check to allow app to fully initialize
        setTimeout(() => {
            this.checkVersion();
        }, 3000);

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
            const platform = Capacitor.getPlatform();
            
            // Build the correct URL based on platform
            const timestamp = new Date().getTime();
            let versionUrl: string;
            
            if (platform === 'web') {
                // On web, use relative URL
                versionUrl = `/assets/version.json?t=${timestamp}`;
            } else {
                // On mobile, fetch from server
                versionUrl = `${this.SERVER_URL}/assets/version.json?t=${timestamp}`;
            }

            const versionInfo = await this.http.get<VersionInfo>(versionUrl).toPromise();

            if (!versionInfo) {
                return false;
            }

            this.currentVersion = versionInfo;

            if (platform === 'web') {
                // Web: Compare with stored version
                return await this.handleWebVersionCheck(versionInfo);
            } else {
                // Mobile: Compare with app version
                return await this.handleMobileVersionCheck(versionInfo);
            }
        } catch (error) {
            console.warn('Version check failed:', error);
            return false;
        }
    }

    /**
     * Handle version check for web platform
     */
    private async handleWebVersionCheck(serverVersion: VersionInfo): Promise<boolean> {
        const storedVersion = this.getStoredVersion();

        // First time - just store the version
        if (!storedVersion) {
            this.storeVersion(serverVersion);
            console.log('Version initialized:', serverVersion.version);
            return false;
        }

        // Compare versions
        if (storedVersion.version !== serverVersion.version || 
            storedVersion.buildTime !== serverVersion.buildTime) {
            console.log('New version detected!', {
                old: storedVersion.version,
                new: serverVersion.version
            });
            
            await this.clearCacheAndReload(serverVersion);
            return true;
        }

        return false;
    }

    /**
     * Handle version check for mobile platform
     */
    private async handleMobileVersionCheck(serverVersion: VersionInfo): Promise<boolean> {
        try {
            const appInfo = await App.getInfo();
            const appVersion = appInfo.version;
            
            // Extract version number from server version (e.g., "18.0.0-692a9422" -> "18.0.0")
            const serverVersionNumber = serverVersion.version.split('-')[0];
            
            // Compare versions
            if (this.isNewerVersion(serverVersionNumber, appVersion)) {
                console.log('App update available!', {
                    installed: appVersion,
                    available: serverVersionNumber
                });
                
                await this.showUpdateNotification(serverVersion);
                return true;
            }
        } catch (error) {
            console.warn('Mobile version check failed:', error);
        }
        
        return false;
    }

    /**
     * Compare version strings (returns true if v1 > v2)
     */
    private isNewerVersion(v1: string, v2: string): boolean {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            
            if (p1 > p2) return true;
            if (p1 < p2) return false;
        }
        
        return false;
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
                            body: `Version ${newVersion.version.split('-')[0]} is available. Tap to update.`,
                            largeBody: `A new version of Loadgistix is available. Update now to get the latest features and improvements.`,
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
            } else {
                // Permission not granted, show in-app alert
                this.showInAppUpdateAlert(newVersion);
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
