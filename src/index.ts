const defers = new Map();

/**
 * Create a new deferral promise, saves it, and returns it.
 * @param id The name/identifier of the deferral. If it exists, it will be overwritten.
 * @returns The promise itself, which will be resolved when `resolveDefer(id)` is called.
 */
export const makeDefer = (id: string): Promise<unknown> => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  defers.set(id, {
    promise,
    resolve,
    reject,
  });
  return promise;
};

/**
 * Gets a deferral, to wait for it to be resolved.
 * @param id The name/identifier of the deferral. 
 * @returns The promise to await/resolve. If it does not exist, returns null.
 */
export const waitForDefer = (id: string): Promise<unknown>|null => {
  return defers.get(id).promise;
};

/**
 * Get an array of currently active deferral IDs
 * @returns An array of string IDs currently active in Deferrals
 */
export const listDefers = ():string[] => Array.from(defers.keys());

/**
 * Resolves a deferral, which will resolve any reference to it in your app.
 * @param id The name/identifier of the deferral to resolve.
 * @param value The value given to all resolved deferrals in your app.
 */
export const resolveDefer = (id: string, value: any): void => {
  defers.get(id).resolve(value);
  defers.delete(id);
};

/**
 * Rejects a deferral, which will reject any reference to it in your app.
 * If not caught, these rejections can cause erors to be thrown in your code!
 * @param id The name/identifier of the deferral to reject.
 * @param error The error string given to your rejected deferrals
 */
export const rejectDefer = (id: string, error: string): void => {
  defers.get(id).reject(error);
  defers.delete(id);
};
