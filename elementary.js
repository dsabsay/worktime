/* Allows for convenient definition of Stateful Components by users.
 * This function essentially generates a "subclass" of Elementary that
 * contains the methods defined by the user.
 */
function Extend(sup, methods, props) {
  const obj = new sup(props);

  Object.keys(methods).map(key => (
    obj[key] = methods[key].bind(obj)
  ));

  obj._initState();

  return obj;
}

const store = {};

class Elementary {
  constructor(props) {
    this._props = props;
    if (!(props.id)) {
      console.error(`A stateful component must have an ID as a prop! State will
        not be preserved across re-renders unless an ID is set.`);
    }

    this._stateIsInitialized = false;
  }

  _applyTheme(theme) {
    this._props.theme = mergeThemes(theme, this._props.theme);
  }

  _initState() {
    // Initialize or retrieve state
    if (!store[this.props.id]) {
      this.initState();  // initState if no state is stored
    } else {
      this.state = store[this.props.id];
    }

    this._stateIsInitialized = true;
  }

  /* Attaches the component to the given DOM node. */
  attachTo(node) {
    this._containerNode = node;
    this._node = this.render()(this._props.theme);
    node.appendChild(this._node);
  }

  /* Returns the DOM node representing the root element in the
   * component's render() method.
   */
  getNode() {
    return this._node;
  }

  get props() {
    return this._props;
  }

  set props(val) {
    console.error('Cannot set props. props is immutable.');
  }

  get state() {
    return this._state;
  }

  set state(val) {
    if (this._stateIsInitialized) {
      console.error('Cannot set state directly. Use changeState() instead.');
      return;
    }
    this._state = val;
    store[this.props.id] = val;  // update store
  }

  /* Updates the component's state object and re-rerenders the component. */
  changeState(delta) {
    var oldState = null;
    if (window.DEBUG) {
      oldState = JSON.parse(JSON.stringify(this.state));
    }

    // Update state
    // TODO: maybe it would be safer to construct a brand new object by merging
    //       the old state and the updates, then setting that to this._state
    //       in one go?
    // function update(stateRef, updates) {
    //   Object.keys(updates).map(key => {
    //     const val = updates[key];
    //     if (typeof val === 'object') {
    //       if (!stateRef[key]) {
    //         stateRef[key] = {};
    //       }
    //       return update(stateRef[key], val);
    //     } else {
    //       stateRef[key] = val;
    //     }
    //   });
    // }
    //
    // update(this._state, delta);
    Object.keys(delta).map(key => this._state[key] = delta[key]);
    store[this.props.id] = this._state;

    // Re-render
    const oldNode = this._node;
    this._node = this.render()(this._props.theme);
    this._containerNode.replaceChild(this._node, oldNode);

    if (window.DEBUG) {
      const stateUpdates = {};
      Object.keys(this.state).map(key => {
        stateUpdates[key] = {
          'Before': oldState[key],
          'After': this.state[key],
        };
      });
      console.log('%cState updated:', 'color: blue; font-size: 1.5em');
      console.table(stateUpdates);
    }
  }
}

function applyProps(el, props) {
  Object.keys(props).map(name => {
    const value = props[name];
    // Add inline styles
    if (name === 'style') {
      Object.keys(value).map(styleName => el.style[styleName] = value[styleName]);
    } else if (typeof value === 'function') {
      el[name] = value;  // handles event listeners like onclick
    } else {
      /* SVG elements don't mirror their DOM properties to their attributes */
      el.setAttribute(name, value);
    }
  });
}

function makeHTMLElement(el) {
  return (props) => {
    const element = document.createElement(el);

    if (props) {
      applyProps(element, props);
    }

    return element;
  }
}

function makeSVGElement(el) {
  return (props) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', el);

    if (props) {
      applyProps(element, props);
    }

    return element;
  }
}

// Returns: (...args) -> (theme) -> Element
function ElementaryFunc(func) {
  // func returns: (props) -> (theme) -> Element
  return (...args) => compose(func, ...args);
}

/* Merges the two themes, allowing the child to override properties from
 * the parent theme. Returns a new object, representing the merged theme.
 */
function mergeThemes(parent, child) {
  var theme = JSON.parse(JSON.stringify(parent || {}));
  if (child === null || child === undefined) {
    return theme;
  }
  Object.keys(child).map(key => {
    if (['string', 'number', 'boolean'].includes(typeof child[key])) {
      theme[key] = child[key];
    } else {
      if (parent && key in parent) {
        theme[key] = mergeThemes(parent[key], child[key]);  // deep copy objects
      } else {
        theme[key] = JSON.parse(JSON.stringify(child[key]));
      }
    }
  });

  return theme;
}

/*
 *
 * Params:
 *    elFunc: A function that returns a closure:
 *            (props) -> (theme) -> Element
 *
 * Returns: (theme) -> Element
 */
function compose(elFunc, ...args) {
  var props = null;
  var text = null;
  var theme = null;

  // Look for props and text (can be in either order)
  for (let i = 0; i < 2 && i < args.length; i++) {
    if (typeof args[i] === 'string' && !text) {
      text = args[i];
    } else if (typeof args[i] === 'object'
        && typeof args[i] !== 'function'
        && !Array.isArray(args[i])
        && !props
        && !(args[i] instanceof Elementary)) {
      props = args[i];
    } else {
      break;
    }
  }

  // Extract theme
  if (props && props.theme) {
    theme = props.theme;
  }

  const start = (props ? 1 : 0) + (text ? 1 : 0);
  args = args.flat(1);  // Flatten arrays in args

  return (parentTheme) => {
    if (props === null) {
      props = {};
    }

    const mergedTheme = mergeThemes(parentTheme, theme);
    props.theme = mergedTheme;

    var element = elFunc(props);  // This handles the makeHTMLElement variety

    if (element === null) {
      return null;
    }

    if (!(element instanceof Element)) {  // This handles ElementaryFunc components
      // TODO: the parentTheme should be passed in here?
      element = element(mergedTheme);
    }

    if (text) {
      element.appendChild(document.createTextNode(text));
    }

    for (let i = start; i < args.length; i++) {
      if (typeof args[i] === 'function') {
        const subElement = args[i](mergedTheme);
        if (subElement !== null) {
          element.appendChild(args[i](mergedTheme));
        }
      } else if (args[i] instanceof Elementary) {
        args[i]._applyTheme(mergedTheme);
        args[i].attachTo(element);
      } else if (args[i] === null) {
        // do nothing
      } else if (typeof args[i] === 'string') {
        element.appendChild(document.createTextNode(args[i]));
      } else {
        console.error('Unsupported argument in element composition: ', args[i]);
      }
    }

    return element;
  };
}

function Route(route, ...components) {
  // TODO: need better matching method
  if (location.pathname !== route) {
    return null;
  }

  // return div(...components);
  return [...components];
}

// HTML Elements
const div = (...args) => compose(makeHTMLElement('div'), ...args);
const span = (...args) => compose(makeHTMLElement('span'), ...args);
const h1 = (...args) => compose(makeHTMLElement('h1'), ...args);
const h2 = (...args) => compose(makeHTMLElement('h2'), ...args);
const p = (...args) => compose(makeHTMLElement('p'), ...args);
const b = (...args) => compose(makeHTMLElement('b'), ...args);
const a = (...args) => compose(makeHTMLElement('a'), ...args);
const button = (...args) => compose(makeHTMLElement('button'), ...args);
const img = (...args) => compose(makeHTMLElement('img'), ...args);
const br = () => compose(makeHTMLElement('br'));
const table = (...args) => compose(makeHTMLElement('table'), ...args);
const tr = (...args) => compose(makeHTMLElement('tr'), ...args);
const th = (...args) => compose(makeHTMLElement('th'), ...args);
const td = (...args) => compose(makeHTMLElement('td'), ...args);

// SVG Elements
const svg = (...args) => compose(makeSVGElement('svg'), ...args);
const text = (...args) => compose(makeSVGElement('text'), ...args);
const circle = (...args) => compose(makeSVGElement('circle'), ...args);
const rect = (...args) => compose(makeSVGElement('rect'), ...args);


export {
  Elementary,
  ElementaryFunc,
  Extend,
  Route,
  compose,
  makeHTMLElement,
  mergeThemes,
  div,
  span,
  h1,
  h2,
  p,
  b,
  a,
  button,
  img,
  br,
  svg,
  circle,
  rect,
  text,
  table,
  tr,
  th,
  td,
};
