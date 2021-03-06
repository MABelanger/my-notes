## create actions

```
src/
  actions/
    courseActions.js
```

The action return the action with the course data and a `type` that is required.

> Note that in ES6 the right hand side match the left inside if the right inside is ommited like course. So return { course:course } become return { course }


```js
export function createCourse(course) {
  return {
    type: 'CREATE_COURSE',
    course
  }
}
```

## Reducers
To handle action we need a reducer. In flux we handle action with store but in redux we handle actions within reducer. A reducer is just a function that accept a state action and return a new state.

```
src/
  reducers/
    courseReducers.js
```

The reducer explode the `state` and create a brand new object action with `Object.assign()`.
Example of reducer :
```js
export default function courseReducer(state = [], action) {
  switch(action.type) {
    case 'CREATE_COURSE':
      return [...state,
        Object.assign({}, action.course)
      ];
  default:
    return state;
  }
}
```


# Root reducer

The root reducer combine the reducers if we are more than one reducer as `index.js`
```
src/
  reducers/
    index.js
```

Notice that we called `courseReducer` but because of the default export we can alias what ever we want as we do with the import to alias `courses`. That simplify the usage of reducer inside `rootReducer`. Now we can avoid the call `state.courseReducer`.

Example of root reducer :
```js
import {combineReducers} from 'redux';
import courses from './courseReducer';


const rootReducer = combineReducers({
  courses // <-ES6 short hand property name
});

export default rootReducer;
```

## Redux Store

```
src/
  store/
    configureStore.js
```


`initialState` is useful when we use server rendering. We can add a peace of middleware with With `applyMiddleware()` so we can specify all middleware we want to apply. `reduxImmutableStateInvariant` that avoid mutable state. We can add more middleware like google chrome extention for react.  To more middleware, checkout react slingshoot for other middleware.

Example of configureStore :
```js
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';



export default function configureStore(initialState) { // initialState for server rendering
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(reduxImmutableStateInvariant())
  );
}
```

## Instantiate Store and Provider
We can wrap up the router with provider inside the `/src/index.js`. So we can access `store` in ours components.

We can pass initial state to overwrite the default value of parameter state = [] specified in the ES6 way inside `each reducer`. But if you want to configure store for server rendering just pass argument into the `configureStore(initialState)` function. So if we want to initialise state pass down to the server or use the local storage. To use the store, we have to use `Provider` from react-redux library. `Provider` is a higher that attach the store to a react container component that take one prop `store`.

Example :

```js
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';


const store = configureStore();
render (
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
```

## Connect container
To connect a container, we use `connect()` from react-redux that we use at the export decorated by the `react-redux.connect()`. The `connect()` take two functions `mapStateToProps` and `mapDispatchToProps` and return a function.

`mapStateToProps()` take two parameters first one is `state` and the second `ownProps`. That return the property that we want to expose to our component. with `this.props.xxx`

`state` represent the state inside the `redux store` acceded by the `root reducer`. `state.xxx` the xxx represent the name that we choose inside the root reducer.

`ownProps` it a reference to the component own props. We can access injected props via react-router


## 3 ways to use mapDispatchToProps

We can use `mapDispatchToProps()` in 3 ways.

### No mapDispatchToProps

`mapDispatchToProps` determine what action we want to expose in our component. If we omited, the component automaticly get a dispatch property attach to it injected by `connect()`. So we can use `this.props.dispatch()`. So the `dispatch()` enable you to fire off your action that we defined in our actions files.


```js

onClickSave() {
  this.this.props.dispatch(
    courseActions.createCourse(this.state.course)
  );
}

mapDispatchToProps = undefined;
// map the store with this.props.courses
function mapStateToProps(state, ownProps) {
  return {
    courses: state.courses
  }
}
const connectStateAndProps = connect(mapStateToProps, mapDispatchToProps);
export default connectStateAndProps(CoursesPage);
```

### mapDispatchToProps() with dispatch
 The first way is to avoid `mapDispatchToProps()` so by default you can use `dispatch()`. The second way is to use the `mapDispatchToProps()`. The dispatch function call the `courseActions` in the right way, with `dispatch()` function because the action `courseActions` return only a object literal.

```js
function mapDispatchToProps(dispatch) {
  return {
    createCourse: course =>
      dispatch(courseActions.createCourse(course));
  };
}
```

### BindActionCreator without dispatch
The third way is to use the helper function that save us to manualy wrap the action creator in a dispatch() call. The function is called bind action creator. You need to import `bindActionCreator`. This function call thispatch for us. Note that we no longer use `createCourse` as a paremeter, we use `actions` that help to clean the separation of the props. But now we use `  this.props.actions.createCourse()` All the course action is map to the dispatch.

```js
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}
```

## Structure
The container have :

<b>a constructor</b> that initialise `states` and also call the `bind function`.

<b>child functions</b> that called by render.

<b>render function</b>: Tipically call a child component. Container component idealy just a child that contain the markup

<b>Prop Types Validation</b>: `.propTypes`

<b>connect related function</b>: `mapStateToProps()` and `mapDispatchToProps()`

<b>Constants</b>: We are better to put actions constant related inside the actions folder.

```
actions/
  actionsTypes.js
```

## Summary




## Why moc API

1. Start before the API exists
2. Independance
3. Backup plan
4. Ultra-fast
5. Test slowness
6. Aids testing
7. Point to the real API later


## Async in redux
1. redux-thunk
  return a function instead a object.

2. redux-promises

3. redux-sage
  Use ES6 generators and rich domain-specific language. 
