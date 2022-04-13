const defers = new Map();

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
};

const waitForDefer = (id) => {
  return defers.get(id).promise;
};

const listDefers = () => Array.from(defers.keys());

const resolveDefer = (id, value) => {
  defers.get(id).resolve(value);
  defers.delete(id);
};

const rejectDefer = (id, error) => {
  defers.get(id).reject(error);
  defers.delete(id);
};

module.exports = {
  makeDefer,
  waitForDefer,
  listDefers,
  resolveDefer,
};
