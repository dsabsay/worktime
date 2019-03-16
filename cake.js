import { ElementaryFunc, Extend, Elementary, compose, makeHTMLElement } from './elementary.js';
import { div, a, h1, h2, p, button, img, br, svg, rect, circle } from './elementary.js';

const DEFAULT_THEME = {
  colors: {
    primary: '#353535',
    secondary: '#e2e2e2',
    background: 'white',
    accent: '#92cff3',
  },
  fontFamily: 'sans-serif',
  spacing: '1rem',
};

const Toggle = (props) => Extend(Elementary, {
  initState: function() {
    this.state = {
      isActive: false,
    };
  },

  handleTransitionEnd: function() {
    this.changeState({
      isActive: !this.state.isActive,
    });
    this.props.onToggle();
  },

  handleClick: function() {
    const node = this.getNode();
    const circle = node.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'circle')
      .item(0);

    circle.addEventListener('transitionend', this.handleTransitionEnd);
    circle.style.transitionDuration = '0.2s';
    circle.style.transitionTimingFunction = 'ease';
    circle.style.transitionProperty = 'transform';
    circle.setAttribute('transform',
      `translate(${this.state.isActive ? -1 : 1}, 0)`);
  },

  render: function() {
    return (
      svg({
        viewBox: `0 0  2 1`,
        style: {
          width: '2rem',
          height: '1rem'
        }},
        rect({
          x: 0.1,
          y: 0.1,
          width: 1.8,
          height: 0.8,
          rx: 0.5,
          ry: 0.5,
          onclick: this.handleClick,
          style: {
            fill: this.state.isActive
              ? this.props.theme.colors.accent
              : this.props.theme.colors.secondary,
            stroke: 'gray',
            strokeWidth: '0.007rem',
            cursor: 'pointer',
          },
        }),
        circle({
          cx: this.state.isActive ? 1.5 : 0.5,
          cy: 0.5,
          r: 0.4,
          onclick: this.handleClick,
          style: {
            fill: 'white',
            cursor: 'pointer',
          },
        })
      )
    );
  }
}, props);

const Card = (props) => Extend(Elementary, {
  handleMouseOver: function() {
    const node = this.getNode();
    node.addEventListener('transitionend', this.handleTransitionEnd);
    Object.keys(this.props.onMouseOverTransition).map(key => node.style[key] = this.props.onMouseOverTransition[key]);
  },

  handleTransitionEnd: function() {
    console.log('handle end');
    const node = this.getNode();
    node.removeEventListener('transitionend', this.handleTransitionEnd);
    Object.keys(this.props.onMouseOverTransition).map(key => node.style[key] = null);

  },

  render: function() {
    return div(this.props.text, {
      onmouseover: this.handleMouseOver,
    });
  }
}, props);

// TODO: Convert to an ElementaryFunc
const Button = (props) => Extend(Elementary, {
  initState: function() {

  },

  handleMouseOver: function() {
    const node = this.getNode();
    node.style.transitionDuration = '0.5s';
    node.style.transitionTimingFunction = 'ease';
    node.style.transitionProperty = 'background-color';
    node.style.backgroundColor = 'gray';
  },

  handleMouseOut: function() {
    const node = this.getNode();
    node.style.transitionDuration = '0.5s';
    node.style.transitionTimingFunction = 'ease';
    node.style.transitionProperty = 'background-color';
    node.style.backgroundColor = this.props.color;
  },

  handleClick: function() {
  },

  render: function() {
    return button(this.props.label, {
      onmouseover: this.handleMouseOver,
      onmouseout: this.handleMouseOut,
      onclick: this.props.onClick || this.handleClick,
      style: {
        border: 'none',
        // transitionProperty: 'background-color',
        // transitionDuration: '1s',
        // transitionTimingFunction: 'ease',
        backgroundColor: this.props.color,
        cursor: 'pointer',
      }}
    );
  }
}, props);

/* Attempts to get the value in obj referenced by keys, and returns defaultValue
 * if unable.
 */
function get(obj, keys, defaultValue) {
  if (!obj) {
    return defaultValue;
  }

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] in obj) {
      obj = obj[keys[i]];
    } else {
      return defaultValue;
    }
  }

  return obj;
}

/* Scales an rem value (string) by scale. */
function scaleRem(rem, scale) {
  return (Number.parseFloat(rem) * scale).toString().concat('rem');
}

const Heading = ElementaryFunc((props) => {
  const size = 'h' + (props && props.size ? props.size : 1);

  return compose(makeHTMLElement(size), {
    style: {
      color: get(props.theme, ['colors', 'primary'], DEFAULT_THEME.colors.primary),
      fontFamily: get(props.theme, ['fontFamily'], DEFAULT_THEME.fontFamily),
      margin: get(props.theme, ['spacing'], DEFAULT_THEME.margin),
      ...props.style,
    }
  });
});

const FlexContainer = ElementaryFunc((props) => (
  div({
    style: {
      display: 'flex',
      flexDirection: props.flexDirection || 'row',
      alignItems: props.alignItems || 'flex-start',
      ...props.style,
    }
  })
));

const FlexItem = ElementaryFunc((props) => (
  div({
    style: {
      margin: props.theme.spacing,
      padding: props.theme.spacing,
      flex: props && props.flex ? props.flex : '0 1 auto',
      ...(props && props.style),
    },
  })
));

export {
  FlexContainer,
  FlexItem,
  Heading,
  Button,
  Card,
  Toggle,
  get,
  scaleRem,
};
