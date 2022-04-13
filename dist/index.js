"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectDefer = exports.resolveDefer = exports.listDefers = exports.waitForDefer = exports.makeDefer = void 0;
const defers = new Map();
/**
 * Create a new deferral promise, saves it, and returns it.
 * @param id The name/identifier of the deferral. If it exists, it will be overwritten.
 * @returns The promise itself, which will be resolved when `resolveDefer(id)` is called.
 */
const makeDefer = (id) => {
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
exports.makeDefer = makeDefer;
/**
 * Gets a deferral, to wait for it to be resolved.
 * @param id The name/identifier of the deferral.
 * @returns The promise to await/resolve. If it does not exist, returns null.
 */
const waitForDefer = (id) => {
    return defers.get(id).promise;
};
exports.waitForDefer = waitForDefer;
/**
 * Get an array of currently active deferral IDs
 * @returns An array of string IDs currently active in Deferrals
 */
const listDefers = () => Array.from(defers.keys());
exports.listDefers = listDefers;
/**
 * Resolves a deferral, which will resolve any reference to it in your app.
 * @param id The name/identifier of the deferral to resolve.
 * @param value The value given to all resolved deferrals in your app.
 */
const resolveDefer = (id, value) => {
    defers.get(id).resolve(value);
    defers.delete(id);
};
exports.resolveDefer = resolveDefer;
/**
 * Rejects a deferral, which will reject any reference to it in your app.
 * If not caught, these rejections can cause erors to be thrown in your code!
 * @param id The name/identifier of the deferral to reject.
 * @param error The error string given to your rejected deferrals
 */
const rejectDefer = (id, error) => {
    defers.get(id).reject(error);
    defers.delete(id);
};
exports.rejectDefer = rejectDefer;
//# sourceMappingURL=index.js.map