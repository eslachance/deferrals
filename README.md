# DEFERRALS

Deferrals is a very simple library that enables the creation of any number of promises which can then be awaited in any other code in your app.

> **de·fer·ral** (noun) _/dəˈfərəl/_ : a postponement of an action or event. act of putting off to a future time.

## Installation

```
npm i deferrals
pnpm add deferrals
yarn add deferrals
```

## Usage Example

```js
// Import the library
const {
  makeDefer,
  waitForDefer,
  resolveDefer
} = require("deferrals");

// Some functions we'll run later
const await1 = async() => {
  const value = await waitForDefer("Defer1");
  console.log(value);
}

const await2 = async() => {
  const value = await waitForDefer("Defer2");
  console.log(value);
}


// Create the first deferral
makeDefer('Defer1');

// Just for fun, create another one!
makeDefer('Defer2');

// Call the 2 functions above - they're promises,
// and will not run until their promises are resolved.
await1();
await2();

// Simulate an async action after 1 second
setTimeout(() => {
  resolveDefer("Defer1", "Defer 1 Resolved!");
}, 1000);

// and another after 2 seconds
setTimeout(() => {
  resolveDefer("Defer2", "Defer 2 Resolved!");
}, 2000);
```

Example for the equivalent of an async constructor:

```js
const {
  makeDefer,
  waitForDefer,
  resolveDefer
} = require("deferrals");

class SomeAsyncWrapper {
  // Private field property!
  #deferName
  constructor(defername) {
    this.#deferName = name
    makeDefer(this.#deferName);
    this.isready = waitForDefer(this.#deferName);
    init()
  }
  async init() {
    // do DB stuff in async mode
    resolveDefer(this.#deferName);
  }
}


const myWrapperInstance = new SomeAsyncWrapper("mydbthing");

const mainfunction = async() {
  await myWrapperInstance.defer;
  // now you know the init() function has finished, whever you use myInstanceWrapper!
}
```

## Require() or import

Deferrals supports using require (CJS) as well as import syntax (ESM) syntax. 

Import looks like this :
```js
import {
  makeDefer,
  waitForDefer,
  resolveDefer
} from 'deferrals';
```

## Definining configurations

Currently very limited configuration, as I only have one thing to let you configure.

The only option you have right now is whether using `waitForDefer(key)` will resolve immediately or wait for that key to be created.
Meaning, if you did NOT call `makeDefer("blah")` , but you call `waitForDefer("blah")` , by default waitForDefer will resolve immediately.

To change this behaviour, you may require or import `setConfig` from deferrals and use this code: 
`setConfig({ waitForUndefined: true });`


## Uses (why the hell does this exist?)

The reason this little project even exists came from a simple question posted on a programming discord: "How do I turn off every even handler in my bot while waiting for my database to reconnect"

The question prompted me to remember what I was previously doing with my [JOSH](https://josh.alterion.dev/) and [Enmap](https://enmap.alterion.dev) modules : the `defer` concept, which returned a promise
that only resolved when my initialisation (connecting to the database, opening tables, etc) was completed. I realised this pattern was useful and I hadn't actually seen it before in javascript,
[though it exists in Golang](https://gobyexample.com/defer).

Some specific advantages of `deferrals` over "regular promises"

- A deferral can be reset by calling makeDefer again with the same name, effectively turning into a "stop and wait, or go" trigger you can control externally.
- You do not need to import the actual promise - importing `waitForDefer` and using the same deferral name means any code in your project, globally, can wait
for any deferral created, resolved, or rejected, from any other location in your code.
- You can have a list of active deferrals, so you know what promises are being waited on currently.

So, there are a few places where a deferral can be used effectively:

- You need a number of functions, events, loops, or any code, to wait for an external trigger to be called (either individually, as a group, or globally).
- You need to shut off all processing on events, streams, or modules, but not _lose_ the incoming event data from calls (in other words, not just "return" which loses the progress in the code).
- You need to wait for _several_ external triggers to synchronize processing.

## Documentation

### makeDefer (name: string) : null

Creates a deferral with a specific name (must be a string name) and returns the promise for that deferral.

The promise returned by `makeDefer` will not resolve or reject on its own. Only one deferral can be created with the same name.
If `makeDefer` is called again with the same name, the promise will be reset to `pending` state.

### resolveDefer (name: string) : null

Resolves a deferral with the specified name. The promise is set to a `resolved` state and any code waiting for the deferral will then trigger.

The deferral name is then deleted from the list (will not appear in `listDefers`)

If the deferral of that name does not exist, nothing happens.

### rejectDefer (name: string) : null

Rejects the deferral with the specified name. The promise is set to a `rejected` state and any catch() or try/catch for this deferral will then trigger.

The deferral name is then deleted from the list (will not appear in `listDefers`)

If the deferral of that name does not exist, nothing happens.

### waitForDefer (name: string) : Promise&lt;void&gt; | null

Attempts to get a deferral by name. If the deferral exists, returns a `promise` which will remain in a pending state until
it's rejected or resolved through the above methods. If the deferral does not exist, returns a promise that instantly resolves to prevent locking the process.

### listDefers () : string[]

Gets a list of defers that are currently pending, as an array of names as strings. Can be looped over to resolve, reject, or any other action.
