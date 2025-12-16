/**
 * GUID Helper Service
 * 
 * Provides utility functions for normalizing and comparing GUIDs.
 * All GUIDs in the application should be normalized to uppercase for consistent comparisons.
 */

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GuidHelper {
    /**
     * Normalizes a GUID to uppercase format
     * @param guid The GUID string to normalize
     * @returns The uppercase GUID, or null if input is null/undefined
     */
    static normalize(guid: string | null | undefined): string | null {
        if (!guid) return null;
        return guid.toUpperCase();
    }

    /**
     * Compares two GUIDs in a case-insensitive manner
     * @param guid1 First GUID
     * @param guid2 Second GUID
     * @returns True if GUIDs match (case-insensitive), false otherwise
     */
    static equals(guid1: string | null | undefined, guid2: string | null | undefined): boolean {
        if (!guid1 || !guid2) return false;
        return guid1.toUpperCase() === guid2.toUpperCase();
    }

    /**
     * Normalizes all GUID properties in an object to uppercase
     * Looks for properties ending in 'Id' or named 'id'
     * @param obj The object to normalize
     * @returns The object with normalized GUIDs
     */
    static normalizeObject<T>(obj: T): T {
        if (!obj || typeof obj !== 'object') return obj;

        const normalized = { ...obj } as any;
        
        for (const key in normalized) {
            if (normalized.hasOwnProperty(key)) {
                const value = normalized[key];
                
                // Check if property is likely a GUID (ends with 'Id' or is 'id')
                if ((key.toLowerCase().endsWith('id') || key === 'id') && typeof value === 'string') {
                    normalized[key] = value.toUpperCase();
                }
                
                // Recursively normalize nested objects
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    normalized[key] = GuidHelper.normalizeObject(value);
                }
                
                // Normalize arrays of objects
                if (Array.isArray(value)) {
                    normalized[key] = value.map(item => 
                        typeof item === 'object' ? GuidHelper.normalizeObject(item) : item
                    );
                }
            }
        }
        
        return normalized as T;
    }

    /**
     * Normalizes an array of objects, ensuring all GUID properties are uppercase
     * @param array The array to normalize
     * @returns The array with normalized GUIDs
     */
    static normalizeArray<T>(array: T[]): T[] {
        if (!array || !Array.isArray(array)) return array;
        return array.map(item => GuidHelper.normalizeObject(item));
    }
}

/**
 * Standalone function for normalizing a GUID to uppercase
 * @param guid The GUID string to normalize
 * @returns The uppercase GUID, or null if input is null/undefined
 */
export function normalizeGuid(guid: string | null | undefined): string | null {
    return GuidHelper.normalize(guid);
}

/**
 * Standalone function for comparing two GUIDs in a case-insensitive manner
 * @param guid1 First GUID
 * @param guid2 Second GUID
 * @returns True if GUIDs match (case-insensitive), false otherwise
 */
export function guidsEqual(guid1: string | null | undefined, guid2: string | null | undefined): boolean {
    return GuidHelper.equals(guid1, guid2);
}

