## Dealing with classes
Two possible approaches:
* Use some preprocessing to auto-generate factory functions for each class-based component.
  * Would have to rename the class names, or something...
* Use functions as constructors to define components instead of class syntax.


## Framework Todos
- [ ] [HIGH PRIORITY] State updates are broken: Need to change them so that Component objects are not reinstantiated whenever they are re-rendered.
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

## Worktime Todos
- [ ] Implement Light/Dark mode
