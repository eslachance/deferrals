# DEFERRALS

Deferrals is a very simple library that enables the creation of any number of promises which can then be awaited in any other code in your app.

## Installation

```
npm i deferrals

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

These deferrals don't need to be created and used in the same file or folder - you can import the library and get the deferals from any file in your project!

## Documentation

Did this thing in about 5 minutes, give me a few more to create some potent docs :P