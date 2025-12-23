import { Injectable, ErrorHandler } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CrashLog {
    timestamp: string;
    error: string;
    stack?: string;
    platform: string;
    deviceId?: string;
    appVersion?: string;
    url?: string;
    userAgent?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CrashLoggerService {
    private readonly STORAGE_KEY = 'loadgistix_crash_logs';
    private readonly MAX_LOGS = 50;
    private deviceId: string = 'unknown';
    private initialized = false;

    constructor(private http: HttpClient) {}

    async init(): Promise<void> {
        if (this.initialized) return;
        
        try {
            const id = await Device.getId();
            this.deviceId = id.identifier;
        } catch (e) {
            console.warn('Could not get device ID');
        }
        
        this.initialized = true;
        
        // Send any pending crash logs to server
        this.sendPendingLogs();
    }

    /**
     * Log an error/crash
     */
    async logError(error: Error | string, context?: string): Promise<void> {
        const crashLog: CrashLog = {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            platform: Capacitor.getPlatform(),
            deviceId: this.deviceId,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
        };

        if (context) {
            crashLog.error = `[${context}] ${crashLog.error}`;
        }

        // Store locally
        this.storeLog(crashLog);

        // Try to send to server
        this.sendToServer(crashLog);

        // Also log to console for debugging
        console.error('🔴 CRASH LOG:', crashLog);
    }

    /**
     * Store log in localStorage
     */
    private storeLog(log: CrashLog): void {
        try {
            const logs = this.getLogs();
            logs.unshift(log);
            
            // Keep only last MAX_LOGS
            if (logs.length > this.MAX_LOGS) {
                logs.length = this.MAX_LOGS;
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
        } catch (e) {
            console.warn('Could not store crash log:', e);
        }
    }

    /**
     * Get all stored logs
     */
    getLogs(): CrashLog[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    /**
     * Clear all logs
     */
    clearLogs(): void {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('Could not clear logs:', e);
        }
    }

    /**
     * Send log to server
     */
    private async sendToServer(log: CrashLog): Promise<void> {
        try {
            await this.http.post(
                `${environment.apiDotNet}device/crash-log`,
                log
            ).toPromise();
        } catch (e) {
            // Failed to send, will retry later
            console.warn('Could not send crash log to server');
        }
    }

    /**
     * Send any pending logs to server
     */
    private async sendPendingLogs(): Promise<void> {
        const logs = this.getLogs();
        for (const log of logs.slice(0, 5)) { // Send up to 5 recent logs
            await this.sendToServer(log);
        }
    }

    /**
     * Get a formatted string of recent logs for display
     */
    getLogsForDisplay(): string {
        const logs = this.getLogs();
        if (logs.length === 0) {
            return 'No crash logs found.';
        }

        return logs.map((log, i) => {
            return `--- Log ${i + 1} ---
Time: ${log.timestamp}
Platform: ${log.platform}
Error: ${log.error}
Stack: ${log.stack || 'N/A'}
URL: ${log.url || 'N/A'}
`;
        }).join('\n');
    }
}

/**
 * Global error handler that catches all unhandled errors
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private crashLogger: CrashLoggerService) {}

    handleError(error: Error): void {
        // Log the error
        this.crashLogger.logError(error, 'UNHANDLED');
        
        // Also throw to console for development
        console.error('Unhandled error:', error);
    }
}

