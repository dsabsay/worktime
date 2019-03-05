## About state
In this version, state is supported inside `Elementary` components. Because the DOM updates are done naively (i.e. the entire tree below the updating component is re-rendered), component instances are lost and new ones created on each update. Normally, this would mean losing the existing state as well. However, `Elementary` components store their state in a persistent "store." When a new component instance is created, the previous state is re-in... _stated_ (see what I did there?). To prevent this from devolving into global mutability madness, the state store is namespaced. Each `Elementary` component must be given a unique ID and that ID is used to access the store. Thus, each logical component instance in the tree has its own isolated namespace to store its state and other component instances cannot access it. The ID must be provided by the user so that it exists in the "render chain" allowing it to remain constant through re-renders, even while the component instances themselves are abandoned and re-instantiated.

> TODO: As an improvement to the below limitation, the state store could detect duplicate uses of an ID, and give an error message.

At this time, the onus is on the user to ensure that every ID used is unique. If an ID is used more than once, the components that share the ID will also share the state store, potentially leading to unexpected state behavior.

## Dealing with classes
Two possible approaches:
* Use some preprocessing to auto-generate factory functions for each class-based component.
  * Would have to rename the class names, or something...
* Use functions as constructors to define components instead of class syntax.


## Framework Todos
- [x] [HIGH PRIORITY] State updates are broken: Need to change them so that Component objects are not reinstantiated whenever they are re-rendered.
  * Simple solution? -> Just keep a list of Component objects and call render() on those?
- [ ] Implement smarter updating: Only replace nodes that have changed.
  * Simple solution: When the component is first attached (via `attach()`), store mapping of all sub-components that are dependent on the state. Then, in `changeState()`, only replace those sub-components.
- [ ] Recursively merge state changes. This may not actually be a good idea. React does a shallow merge anyway...
- [ ] Short-circuit state updates if no state has actually changed.
- [ ] Router (for GitHub Pages)
- [x] Watch for file changes and auto-refresh page (dev server).
- [ ] Create grid layout components.
- [ ] Implement a CSS theme framework.
- [ ] Implement a common transition-able component.
  * Would be great to include a callback that is called after the element is rendered to the screen (for slide-in animations, for example).
  * One possibility is to provide an API like this:
    ```
    Box({
      text: "I'm animated",
      transitions: {
        mouseover: {
          transitionDuration: '1s',
          transitionProperty: 'transform',
          transform: 'scale(2)',
        },
        mouseout: {
          transitionDuration: '1s',
          transitionProperty: 'transform',
          transform: 'scale(1)'
        },
        click: {
          transitionDuration: '0.5s',
          transitionProperty: 'background-color',
          backgroundColor: 'black',
        },
      }
    }),
    ```


  - [ ] If props are required, but not supplied, provide a useful error message.
  - [ ] Check for duplicate IDs in the store. Produce error message if a duplicate ID is used.
    - Can be implemented by setting a flag at the beginning of every update, recording all IDs used during that update, and producing the error when a duplicate ID is used.

## Worktime Todos
- [ ] Implement Router (for GitHub Pages)
- [ ] Implement Light/Dark mode
- [ ] Build menu component
