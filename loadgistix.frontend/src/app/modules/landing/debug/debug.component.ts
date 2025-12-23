import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashLoggerService, CrashLog } from 'app/services/crash-logger.service';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';

@Component({
    selector: 'app-debug',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="min-h-screen bg-gray-900 text-white p-4">
            <h1 class="text-2xl font-bold mb-4">🔧 Debug Console</h1>
            
            <!-- Device Info -->
            <div class="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 class="text-lg font-semibold mb-2">📱 Device Info</h2>
                <div class="text-sm font-mono space-y-1">
                    <p>Platform: <span class="text-green-400">{{ platform }}</span></p>
                    <p>Device ID: <span class="text-green-400">{{ deviceId }}</span></p>
                    <p>App Version: <span class="text-green-400">{{ appVersion }}</span></p>
                    <p>User Agent: <span class="text-green-400 text-xs break-all">{{ userAgent }}</span></p>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-wrap gap-2 mb-4">
                <button 
                    (click)="refreshLogs()" 
                    class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
                    🔄 Refresh
                </button>
                <button 
                    (click)="clearLogs()" 
                    class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">
                    🗑️ Clear Logs
                </button>
                <button 
                    (click)="testCrash()" 
                    class="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm">
                    ⚠️ Test Crash
                </button>
                <button 
                    (click)="copyLogs()" 
                    class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm">
                    📋 Copy Logs
                </button>
            </div>
            
            <!-- Crash Logs -->
            <div class="bg-gray-800 rounded-lg p-4">
                <h2 class="text-lg font-semibold mb-2">🔴 Crash Logs ({{ logs.length }})</h2>
                
                <div *ngIf="logs.length === 0" class="text-gray-400 italic">
                    No crash logs found. That's good!
                </div>
                
                <div *ngFor="let log of logs; let i = index" class="mb-4 border-b border-gray-700 pb-4">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-red-400 font-semibold">Log #{{ i + 1 }}</span>
                        <span class="text-gray-500 text-xs">{{ log.timestamp }}</span>
                    </div>
                    <div class="bg-gray-900 rounded p-2 text-sm font-mono">
                        <p class="text-yellow-400 mb-1">{{ log.error }}</p>
                        <pre *ngIf="log.stack" class="text-gray-400 text-xs overflow-x-auto whitespace-pre-wrap">{{ log.stack }}</pre>
                        <p class="text-gray-500 text-xs mt-2">Platform: {{ log.platform }}</p>
                    </div>
                </div>
            </div>
            
            <!-- Back Button -->
            <div class="mt-6">
                <a href="/" class="text-blue-400 hover:underline">← Back to Home</a>
            </div>
        </div>
    `
})
export class DebugComponent implements OnInit {
    logs: CrashLog[] = [];
    platform: string = 'unknown';
    deviceId: string = 'unknown';
    appVersion: string = 'unknown';
    userAgent: string = 'unknown';

    constructor(private crashLogger: CrashLoggerService) {}

    async ngOnInit(): Promise<void> {
        this.platform = Capacitor.getPlatform();
        this.userAgent = navigator.userAgent;
        
        try {
            const deviceInfo = await Device.getId();
            this.deviceId = deviceInfo.identifier;
        } catch {
            this.deviceId = 'N/A';
        }
        
        if (this.platform !== 'web') {
            try {
                const appInfo = await App.getInfo();
                this.appVersion = appInfo.version;
            } catch {
                this.appVersion = 'N/A';
            }
        } else {
            this.appVersion = 'Web';
        }
        
        this.refreshLogs();
    }

    refreshLogs(): void {
        this.logs = this.crashLogger.getLogs();
    }

    clearLogs(): void {
        if (confirm('Are you sure you want to clear all crash logs?')) {
            this.crashLogger.clearLogs();
            this.refreshLogs();
        }
    }

    testCrash(): void {
        try {
            throw new Error('Test crash from debug console');
        } catch (error) {
            this.crashLogger.logError(error as Error, 'DEBUG_TEST');
            this.refreshLogs();
            alert('Test crash logged!');
        }
    }

    copyLogs(): void {
        const logsText = this.crashLogger.getLogsForDisplay();
        navigator.clipboard.writeText(logsText).then(() => {
            alert('Logs copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy. Logs:\n\n' + logsText);
        });
    }
}

