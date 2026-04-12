// Timestamp utilities for converting Firestore Timestamp arrays and objects to standard formats

/**
 * Converts Firestore Timestamps or any objects containing them into regular ISO strings or Date objects.
 * Useful for deeply nested objects before serialization.
 */
export function convertTimestamps(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => convertTimestamps(item));
  }

  // Handle Firestore Timestamp specifically (duck typing check since we might not have the class imported or in the same context)
  if (typeof data === 'object' && 'toDate' in data && typeof data.toDate === 'function') {
    // Assuming it's a Firestore Timestamp, convert to ISO string
    return data.toDate().toISOString();
  }

  // Handle Date instances
  if (data instanceof Date) {
    return data.toISOString();
  }

  // Handle general objects (recursively)
  if (typeof data === 'object') {
    const result: any = {};
    for (const key of Object.keys(data)) {
      result[key] = convertTimestamps(data[key]);
    }
    return result;
  }

  // Return primitive values as is
  return data;
}
