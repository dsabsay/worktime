function Extend(sup, methods, props) {
  const obj = new sup(props);
  // Object.assign(obj, methods);
  Object.keys(methods).map(key => (
    obj[key] = methods[key].bind(obj)
  ));

  return obj;
}

class Elementary {
  constructor(props) {
    this._props = props;
    console.log('props: ', props);
  }

  /* Attaches the component to the given DOM node. */
  attach(node) {
    this._containerNode = node;
    this._node = node.appendChild(this.render());
  }

  getNode() {
    return this._node;
  }

  /* Allow this.state to be set in the init() method. */
  _init() {
    this._isInitialized = false;
    if (this.init) {
      this.init();
    }
    this._isInitialized = true;
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
  }

  /* Updates the component's state object and re-rerenders the component. */
  changeState(delta) {
    var oldState = null;
    if (window.DEBUG) {
      oldState = JSON.parse(JSON.stringify(this.state));
    }

    Object.keys(delta).map(key => this._state[key] = delta[key]);
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

function makeElement(el, ...args) {
  var isTextFound = false;
  const element = document.createElement(el);

  if (args.length < 1) {
    return element;
  }

  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'string' && !isTextFound) {
      element.appendChild(document.createTextNode(args[i]));
      isTextFound = true;  // Only allow one text argument
    } else if (args[i] instanceof Element) {
      element.appendChild(args[i]);  // append composed elemented
    } else if (args[i] instanceof Elementary) {
      // TODO: init should only be called once, ever. When smarter DOM
      //       updating is implemented, this will probably be removed.
      args[i]._init();
      args[i].attach(element);
    } else if (typeof args[i] === 'object') {
      Object.keys(args[i]).map(name => {
        // Add inline styles
        if (name === 'style') {
          Object.keys(args[i].style).map(styleName => element.style[styleName] = args[i].style[styleName]);
        } else {
          element[name] = args[i][name];
        }
      });
    } else {
      console.error('Unsupported argument in element composition: ', args[i]);
    }
  }

  return element;
}

const div = (...args) => makeElement('div', ...args);
const h1 = (...args) => makeElement('h1', ...args);
const h2 = (...args) => makeElement('h2', ...args);
const p = (...args) => makeElement('p', ...args);
const a = (...args) => makeElement('a', ...args);
const button = (...args) => makeElement('button', ...args);
const img = (...args) => makeElement('img', ...args);
const br = () => makeElement('br');

function ElementaryFunc(func) {
  return (...args) => {
    var props = null;
    var text = null;

    // Look for props and text (can be in either order)
    for (let i = 0; i < 2 && i < args.length; i++) {
      if (typeof args[i] === 'string' && !text) {
        text = args[i];
      } else if (typeof args[i] === 'object'
          && !(args[i] instanceof Element)
          && !(args[i] instanceof Elementary)
          && !props) {
        props = args[i];
      } else {
        break;
      }
    }

    // If no props were given, pass an empty object to allow short-circuiting
    // in the ElementaryFunc component.
    const element = func(props ? props : {});

    if (text) {
      element.appendChild(document.createTextNode(text));
    }

    // If first arg was props, start at index 1
    const start = (props ? 1 : 0) + (text ? 1 : 0);
    for (let i = start; i < args.length; i++) {
      if (args[i] instanceof Element) {
        element.appendChild(args[i]);
      } else if (args[i] instanceof Elementary) {
        // TODO: init should only be called once, ever. When smarter DOM
        //       updating is implemented, this will probably be removed.
        args[i]._init();
        args[i].attach(element);
      } else {
        console.error('Unsupported argument in element composition: ', args[i]);
      }
    }

    return element;
  }
}

export {
  Elementary,
  ElementaryFunc,
  Extend,
  makeElement,
  div,
  h1,
  h2,
  p,
  a,
  button,
  img,
  br,
};
