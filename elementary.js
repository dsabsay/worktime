function makeElement(el, ...args) {
  const element = document.createElement(el);

  if (args.length < 1) {
    return element;
  }

  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'string') {
      element.appendChild(document.createTextNode(args[i]));
    } else if (args[i] instanceof Element) {
      element.appendChild(args[i]);  // append composed elemented
    } else if (typeof args[i] === 'object') {
      Object.keys(args[i]).map(name => element.setAttribute(name, args[i][name]));
    } else {
      console.error('Unsupported argument in element composition: ', args[i]);
    }
  }

  return element;
}

const div = (...args) => makeElement('div', ...args);
const h1 = (...args) => makeElement('h1', ...args);
const p = (...args) => makeElement('p', ...args);
const a = (...args) => makeElement('a', ...args);

export { div, h1, p, a };
