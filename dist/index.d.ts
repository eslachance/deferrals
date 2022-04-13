/**
 * Create a new deferral promise, saves it, and returns it.
 * @param id The name/identifier of the deferral. If it exists, it will be overwritten.
 * @returns The promise itself, which will be resolved when `resolveDefer(id)` is called.
 */
export declare const makeDefer: (id: string) => Promise<unknown>;
/**
 * Gets a deferral, to wait for it to be resolved.
 * @param id The name/identifier of the deferral.
 * @returns The promise to await/resolve. If it does not exist, returns null.
 */
export declare const waitForDefer: (id: string) => Promise<unknown> | null;
/**
 * Get an array of currently active deferral IDs
 * @returns An array of string IDs currently active in Deferrals
 */
export declare const listDefers: () => string[];
/**
 * Resolves a deferral, which will resolve any reference to it in your app.
 * @param id The name/identifier of the deferral to resolve.
 * @param value The value given to all resolved deferrals in your app.
 */
export declare const resolveDefer: (id: string, value: any) => void;
/**
 * Rejects a deferral, which will reject any reference to it in your app.
 * If not caught, these rejections can cause erors to be thrown in your code!
 * @param id The name/identifier of the deferral to reject.
 * @param error The error string given to your rejected deferrals
 */
export declare const rejectDefer: (id: string, error: string) => void;
