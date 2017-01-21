## ES6 Modules and Classes
The class still consider wrapper of constructor of ES5.
good reference : [mozilla.org:class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
> **Note:** When we load module in ES6 it always load it in `strict mode`. So, when we do not declare variable with `let` or `var` we get an error `runtime error : variable undefined in strict mode`.

The `import` and `export` is the basic way to communicate between modules to share informations.

```js
// File base.js:
import { projectId } from './module1.js';
console.log(projectId);
```
```js
// File module1.js:
export let projectId = 99;
```

So the variable projectId get imported from module1. It possible to export many variables. We assign alias to the imported variable with the keyword `as`
```js
// File base.js:
import { projectId as id, projectName } from './module1.js';
console.log(`${projectName} has id: ${id}`);
```
```js
// File module1.js:
export let projectId = 99;
export let projectName = "BuildIt";
```

> **Note:** The import statement get hoisted first. So dependency will executed first.

```js
// File base.js:
console.log("starting in base");
import { projectId as id, projectName } from './module1.js';
console.log("ending in base");

```
```js
// File module1.js:
export let projectId = 99;
console.log("in module1");

// in module1
// starting in base
// ending in base
```

We can specify a default value with `export default` that it can be use without or with an alias name.
```js
// File base.js:
import someValue from './module1.js';
import { default as someValue2 } from './module1.js';
console.log(someValue); // BuildIt
console.log(someValue2); // BuildIt

```
```js
// File module1.js:
export let projectId = 99;
let projectName = 'BuildIt';
export default projectName;
```


We can export `as default` if we export multiple object at once.
```js
// File base.js:
import someValue from './module1.js';
console.log(someValue); // BuildIt

```
```js
// File module1.js:
export let projectId = 99;
let projectName = 'BuildIt';
export {
 projectId as default,
 projectName
};
```

We can use `import *` the * refer to all the exports, so we get an object of the exported values. When we use the * the alias `as` is require.

```js
// File base.js:
import * as values from './module1.js';
console.log(values); // { projectId : 99, projectName: 'BuildIt' }

```
```js
// File module1.js:
export let projectId = 99;
let projectName = 'BuildIt';
export {
 projectId,
 projectName
};
```

The imported name can not be reuse. It read only like a const but the property on it can be modify on the exported module.

```js
// File base.js:
import { project, showProject } from './module1.js';
project.projectId = 8000;
showProject();
console.log(project.projectId); // 8000

```
```js
// File module1.js:
export let project = { projectId: 99 };
export function showProject() {
  console.log(project.projectId); // 8000
};
```

> **Note:** the export work with name export, when we export we only export the name, so it is possible to update the name so it can point to other function or value

### Class Fundamentals
It a new syntax to work with prototypes and constructor function that we where used in ES5.

You can think of the class is a constructor function as used in ES5.
```js
class Task {

}
console.log(typeof Task); // function
```
Like new object in ES5
```js
class Task {
}
let task = new Task();
console.log(typeof task); // object
```
We are able to determine the class of an instantiate object using `instanceof`
```js
class Task {
}
let task = new Task();
console.log(task instanceof Task); // true
```