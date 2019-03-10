function Extend(sup, methods, props) {
  const obj = new sup(props);
  // Object.assign(obj, methods);
  Object.keys(methods).map(key => (
    obj[key] = methods[key].bind(obj)
  ));

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

    this._isInitialized = false;
  }

  _applyTheme(theme) {
    // TODO: allow component to override theme
    this._theme = theme;
    this.props.theme = theme;
  }

  _init() {
    console.log(this);
    // Initialize or retrieve state
    if (!store[this.props.id]) {
      this.initState();  // initState if no state is stored
      this._isInitialized = true;
    } else {
      this.state = store[this.props.id];
      this._isInitialized = true;
    }
  }

  /* Attaches the component to the given DOM node. */
  attachTo(node) {
    this._containerNode = node;
    this._node = this.render()(this._theme);
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
    console.error('Cannot set props. props is immutable.')
  }

  get state() {
    return this._state;
  }

  set state(val) {
    if (this._isInitialized) {
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
    console.log(`this._state: ${this._state}`);
    console.log(this._state);
    store[this.props.id] = this._state;

    // Re-render
    const oldNode = this._node;
    this._node = this.render();
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

function ElementaryFunc(func) {
  // func returns: (props) -> (theme) -> Element
  return (...args) => compose(func, ...args);
}

function Route(route, ...components) {
  // TODO: need better matching method
  if (location.pathname !== route) {
    return null;
  }

  // return div(...components);
  return [...components];
}

function withTheme(theme, elFunc) {

}

// Returns an element
function composeWithTheme() {

}

/* elFunc: A function that returns a closure:
 *         (props) -> (theme) -> Element
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
        && !props) {
      props = args[i];
    } else {
      break;
    }
  }

  // Extract theme
  if (props && props.theme) {
    theme = props.theme;
  }
  // NOTE: need to pass empty object if props == null???
  // const element = func(props ? props : {});

  const start = (props ? 1 : 0) + (text ? 1 : 0);
  args = args.flat(1);  // Flatten arrays in args

  return (th) => {
    // TODO: allow children to override theme
    // TODO: merge outer `theme` and inner `th`?
    if (props === null) {
      props = {};
    }
    if (th) {
      props.theme = JSON.parse(JSON.stringify(th));
    }

    var element = elFunc(props);  // This handles the makeHTMLElement variety
    if (!(element instanceof Element)) {
      element = element(theme);  // This handles the ElementaryFunc components
    }

    if (text) {
      element.appendChild(document.createTextNode(text));
    }

    for (let i = start; i < args.length; i++) {
      // TODO: does this branch gobble up the Elementary's? (i.e. is an
      // Elementary object's typeof === function?
      if (typeof args[i] === 'function') {
        element.appendChild(args[i](theme));
      } else if (args[i] instanceof Elementary) {
        // TODO: init should only be called once, ever. When smarter DOM
        //       updating is implemented, this will probably be removed.
        args[i]._applyTheme(theme);
        args[i]._init();
        args[i].attach(element);
      } else if (args[i] === null) {
        // do nothing
      } else {
        console.error('Unsupported argument in element composition: ', args[i]);
      }
    }

    return element;
  };
}

// HTML Elements
const div = (...args) => compose(makeHTMLElement('div'), ...args);
const h1 = (...args) => compose(makeHTMLElement('h1'), ...args);
const h2 = (...args) => compose(makeHTMLElement('h2'), ...args);
const p = (...args) => compose(makeHTMLElement('p'), ...args);
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
  div,
  h1,
  h2,
  p,
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
