/**
 * Helper utility for handling API responses
 * Provides consistent handling of data that can be returned as either arrays or objects
 */

/**
 * Extracts data from API response that may be an array or object
 * @param data The API response data (can be array or object)
 * @returns The first item if array, or the object itself
 */
export function extractApiData<T>(data: T | T[]): T | null {
    if (!data) {
        return null;
    }
    
    // If it's an array, return the first element
    if (Array.isArray(data)) {
        return data.length > 0 ? data[0] : null;
    }
    
    // Otherwise, return the object itself
    return data;
}

/**
 * Safely extracts data from API response with type checking
 * @param data The API response data
 * @returns The extracted data or null if invalid
 */
export function safeExtractApiData<T>(data: any): T | null {
    try {
        return extractApiData<T>(data);
    } catch (error) {
        console.error('Error extracting API data:', error);
        return null;
    }
}

