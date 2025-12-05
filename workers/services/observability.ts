/**
 * Decorator for observing HTTP calls made by functions
 * Logs function calls, success/error status, and execution time
 * Uses legacy decorator syntax (experimentalDecorators: true)
 *
 * Usage:
 * ```typescript
 * class MyService {
 *   @observeHttpCall
 *   async fetchData() {
 *     return await axios.get('/api/data');
 *   }
 * }
 * ```
 *
 * Output:
 * - Start: "[HTTP] call MyService.fetchData"
 * - Success: "[HTTP] call success MyService.fetchData HTTP status 200 in 150ms"
 * - Error: "[HTTP] call error MyService.fetchData after 150ms: [error details]"
 */
export function observeHttpCall(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  // Skip decoration in environments where descriptor is invalid
  if (!descriptor || typeof descriptor.value !== 'function') {
    return descriptor;
  }

  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const startTime = Date.now();
    const className = target?.constructor?.name || 'UnknownClass';
    const functionName = `${className}.${propertyKey}`;

    console.debug(`[HTTP] call ${functionName}`);

    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - startTime;

      // Try to extract HTTP status from the result
      let statusLog = '';
      if (result && typeof result === 'object') {
        // Handle axios response
        if (result.status) {
          statusLog = ` with status ${result.status}`;
        }
        // Handle node-fetch response
        else if (result.statusCode) {
          statusLog = ` with status ${result.statusCode}`;
        }
        // Handle raw Response object
        else if (result.ok !== undefined) {
          statusLog = ` with status ${result.status}`;
        }
      }

      console.debug(`[HTTP] call success ${functionName} HTTP status ${statusLog} in ${duration} ms`);
      return result;
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[HTTP] call error ${functionName} after ${duration} ms:`, err);
      throw err;
    }
  };

  return descriptor;
}

/**
 * Higher-order function for observing HTTP calls made by functions
 * Logs function calls, success/error status, and execution time
 *
 * Usage:
 * ```typescript
 * const observedFetchData = observeHttpCallHOF('fetchData', async () => {
 *   return await axios.get('/api/data');
 * });
 * ```
 *
 * Output:
 * - Start: "[HTTP] call fetchData"
 * - Success: "[HTTP] call success fetchData HTTP status 200 in 150ms"
 * - Error: "[HTTP] call error fetchData after 150ms: [error details]"
 */
export function withObserveHttpCall<T extends (...args: any[]) => Promise<any>>(
  functionName: string,
  originalFunction: T
): T {
  return (async (...args: Parameters<T>) => {
    const startTime = Date.now();

    console.debug(`[HTTP] call ${functionName}`);
    try {
      const result = await originalFunction(...args);
      const duration = Date.now() - startTime;

      // Try to extract HTTP status from the result
      let statusLog = '';
      if (result && typeof result === 'object') {
        // Handle axios response
        if (result.status) {
          statusLog = ` with status ${result.status}`;
        }
        // Handle node-fetch response
        else if (result.statusCode) {
          statusLog = ` with status ${result.statusCode}`;
        }
        // Handle raw Response object
        else if (result.ok !== undefined) {
          statusLog = ` with status ${result.status}`;
        }
      }

      console.debug(`[HTTP] call success ${functionName} HTTP status ${statusLog} in ${duration} ms`);
      return result;
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[HTTP] call error ${functionName} after ${duration} ms:`, err);
      throw err;
    }
  }) as T;
}
