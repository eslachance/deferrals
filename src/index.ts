const defers = new Map<string, Defer>();

interface Defer {
  promise: Promise<unknown>;

  resolve(value: unknown): void;

  reject(reason: string): void;
}

/**
 * Create a new deferral promise, saves it and returns it.
 * @since 1.0.0
 * @param key The identifier of the deferral. If it exists, it will be overwritten.
 * @returns The promise itself, which will be resolved when {@link resolveDefer} is called.
 */
export function makeDefer(key: string): Promise<unknown> {
  let resolve: (value: unknown) => void;
  let reject: (reason?: any) => void;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // @ts-expect-error 2454
  defers.set(key, { promise, resolve, reject });

  return promise;
}

/**
 * Gets a deferral, to wait for it to be resolved.
 * @since 1.0.0
 * @param key The identifier of the deferral.
 * @returns The promise to resolve. If it does not exist, returns null.
 */
export function waitForDefer(key: string): Promise<unknown> | null {
  return defers.has(key) ? defers.get(key)!.promise : null;
}

/**
 * Get an array of currently active deferrals by key.
 * @since 1.0.0
 * @returns An array of string keys currently active in deferrals.
 */
export function listDefers(): string[] {
  return Array.from(defers.keys());
}

/**
 * Resolves a deferral, which will resolve any reference to it in your app.
 * @since 1.0.0
 * @param key The identifier of the deferral to resolve.
 * @param value The value given to all resolved deferrals in your app.
 */
export function resolveDefer(key: string, value: unknown): void {
  if (defers.has(key)) {
    defers.get(key)!.resolve(value);
    defers.delete(key);
  }
}

/**
 * Rejects a deferral, which will reject any reference to it in your app.
 * @since 1.0.0
 * @param key The identifier of the deferral to reject.
 * @param reason The reason given to your rejected deferrals
 */
export function rejectDefer(key: string, reason?: any): void {
  if (defers.has(key)) {
    defers.get(key)!.reject(reason);
    defers.delete(key);
  }
}