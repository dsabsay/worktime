# Design Doc: with-theme

## Problem
Users should be able to inject a theme at any level in their hierarchy of components and have that theme flow downward, applying to all components underneath the component that injected the theme. For now, the theme represents a simple color scheme, but in the future a solution to this problem could be used to inject other, more general styling.

## Possible Solutions

### Intermediate composition step
Modify `compose()` to return a tree structure where each node is a closure that returns the actual element given the `theme`. Then we can traverse the tree, injecting themes in a hierarchical fashion, and connecting the DOM nodes together.

How do we represent this tree? Can we represent it on the call stack?

Symbol  |  Meaning
--|--
`:`  |  Returns
`(args, ...) -> <type>`  |  Function

`compose(): (theme) -> element`

## Implemented Solution
The return type of `compose()` is `(theme) -> Element` (where Element is a DOM Element type). Previously, the return type of `compose()` was merely `Element`. But now, we delay full evaluation of each Element and Component until all arguments to the root (top-level) `compose()` call have been evaluated. Thus, the initial call to `compose()` will yield a "top-level" closure of type `(theme) -> Element` and it is the responsibility of the initial caller to then apply that closure to whichever theme is desired. The theme applied at this level would represent the "global" theme that cascades downward to all components in the application (unless those components choose to override the theme).

When using an `Elementary` stateful component, this is taken care of by the `Elementary` class in the `attachTo()` method. For `ElementaryFunc` function components, the top-level caller of the particular function component must apply the desired theme to the returned closure, as in the example below:
```js
const TestApp = ElementaryFunc((props) => (
  div(
    'div inside TestApp function component',
    p(
      {style: { color: props.theme.color } },
      'test'
    )
  )
));

var app = TestApp();  // This results in a call to compose(), returning a closure
var appElement = app({ color: 'red' });  // Apply the closure with a theme
document.body.appendChild(appElement);
```

In this example, the `p` element sets its color based on the theme that is passed to the `TestApp` function component.

### Limitations and potential remediations

#### Themes have limited scope
Currently, themes cannot be passed down between standard Element types (i.e. `div`, `p`, `a`, etc.). Take the following example as illustration:
```js
const TestApp = ElementaryFunc((props) => (
  div(
    { theme: { color: 'blue' } },
    p(
      'I am inside the div',
      {
        style: {
          color: props.theme.color,
        }
      }
    ),
  )
));
```
The `p` element is wrapped inside a `div` that has set a theme; however, the `style.color` style for the `p` element is evaluated within the scope of the same function. Thus, it has no knowledge of the theme that was given to its parent `div` element.

One possible way to fix this would be to supply the color style for the `p` element as a string, like so:
```js
{
  style: {
    color: 'props.theme.color',
  }
}
```
Then, when applying the styles and attributes to the `p` DOM Element, the string could be used as the key to look up the value in either the final `props` or `theme` object that is passed to the function that constructs the DOM Element. That might look something like this:
```js
function makeHTMLElement(el) {
  return (props) => {
    const element = document.createElement(el);

    // Strip the leading 'props.'
    const givenKey = props.style.color.slice(props.style.color.indexOf('.'));
    const colorFromTheme = props[givenKey];
    element.style.color = colorFromTheme;

    return element;
  }
}
```
A special syntax could even be introduced if necessary or beneficial. For example, when the user supplies the style:
```js
p(
  'I am inside the div',
  {
    style: {
      color: '$.theme.color',
    }
  }
)
```
This could be used as the cue to evaluate the given string as a key. We'd then of course need a way to escape such special characters, and we'd need to make this mechanism abundantly obvious to users. It could be quite confusing to users who are unaware.
