## Iterators, Generators and Promises

### Iterators
Iterators is a major new feature in ES6 and is found all over the place.

To get access to the iterator use `Symbol.iterator` as the property name.

```js
let ids = [1, 2, 3];
console.log( typeof ids[Symbol.iterator] ); // function
```

We can use the iterator with `next()` that return a special object with two property `done` and `value`. If done is false we are not exhausted the iterator yet and the value is the value of it. If it's done, we get done to true and value as undefined. Iterator is builtin in the array object.

```js
let ids = [1, 2, 3];
let it = ids[Symbol.iterator](); //
console.log( it.next() ); // {done: false, value: 1}
console.log( it.next() ); // {done: false, value: 2}
console.log( it.next() ); // {done: false, value: 3}
console.log( it.next() ); // {done: true, value: undefined}
```
We can make our own iterator we need to implement `[Symbol.iterator]` with `next()` that return {value: , done: }

The for-of statement accepts any iterable object, thus providing an uniform iteration syntax to completely distinct data structures by making use of the Iterable interface they implement.

The spread operator `...` use iterator to destructure elements.
```js
idMaker = {
  [Symbol.iterator]() {
    let nextId = 1;
    return {
      next() {
        let value = nextId > 3 ? undefined: nextId++;
        let done = !value;
        return { value, done };
      }
    };
  }
};
for (let v of idMaker) {
  console.log(v);
} // 1 2 3
console.log(...idMaker)
```
### Generators
It a special function that don't run all the way through necessary it is able to yeald and be call multiple times through all of your code. It does not exist on the stack like must function do. We actualy use iterator to call generator multiple times. We denote generator by the `*` at the begining of the function. Wen we run the function, it return a iterator. It start off with the pause state.

```js
function *process() {
  console.log('a');
  yield 1; // First pose before yield
  console.log('b');
  yield 2; // Second pose before the second yield
  console.log('c');
}
let it = process();
console.log(it.next()); // a Object {value: 1, done: false}
console.log(it.next()); // b Object {value: 2, done: false}
console.log(it.next()); // c Object {value: undefind, done: true}
console.log(it.next()); // Object {value: undefind, done: true} <- no more to iterate
```

 You can use generator that always return a next value with a `while(true)`

```js
function *process() {
  let nextId = 0;
  while(true) {
    yield nextId;
    nextId += 1;
  }
}
for (let id of process()) {
  if (id > 3){
    break;
  }
  console.log(id);
} // 0 1 2 3
```

You can pass a value to `yield` it stop a the first yield and then the unpose of the next yield pass the value.

```js
function *process() {
  let result = yield;
  console.log(`result is ${result}`);
}
let it = process();
it.next();
it.next(200);
```

We can assign an array with the yield

```js
function *process() {
  let newArray =[yield, yield, yield];
  console.log(newArray[2]);
}
let it = process();
it.next();
it.next(2);
it.next(4);
it.next(42);
// 42
```

If you use the multiply put it between ()

```js
function *process() {
  let value = 4 * (yield 42);
  console.log(value);
}
let it = process();
console.log( it.next() ); // 42
it.next(10); // 40
```

### Iterator delegation
`yield*` take some thing that it's iterable so we can delegate another iterator to the generator. Once that iterator is fully consumed, that previous iterator will take over again.

```js
function *process() {
  yield 42;
  yield* [1,2,3];
}
let it = process();
console.log( it.next().value ); // 42
console.log( it.next().value ); // 1
console.log( it.next().value ); // 2
console.log( it.next().value ); // 3
console.log( it.next().value ); // undefind
```

### throw and return
You can throw exception by using `.throw()` when we use it, it stop the generator and it call the `catch()` block and return `{value: undefined, done: true}` and skip all other lines of code as the generator as reached the end of it's function. In this example `b` never get printed.
```js
function *process() {
  try {
    console.log('a');
    yield 1;
    console.log('b');
    yield 2;
    console.log('c');
    yield 3;
    console.log('d');
  }
  catch(e) {
    console.log(e);
  }
}
let it = process();
console.log( it.next().value );  // a & 1
console.log( it.throw('error') );// 'error' & {value: undefined, done: true}
console.log( it.next() );        // {value: undefined, done: true}
```
