import { ElementaryFunc, Extend, Elementary, compose, makeHTMLElement } from './elementary.js';
import { div, a, h1, h2, p, button, img, br, svg, rect, circle } from './elementary.js';

// TODO: We shouldn't pass in the theme like this. Need a better solution.
import { theme } from './src/globals.js';

// const theme = {
//   colors: {
//     primary: '#353535',
//     secondary: '#e2e2e2',
//     background: 'white',
//     accent: '#92cff3',
//   },
//   fontFamily: 'sans-serif',
//   spacing: '1rem',
// };

// const Button = ElementaryFunc((props) => {
//   return button({
//     onmouseover: () =>
//     style: {
//       border: 'none',
//       backgroundColor: theme.colors.accent,
//       cursor: 'pointer',
//     }}
//   );
// });

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
            fill: this.state.isActive ? theme.colors.accent : theme.colors.secondary,
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

const Heading = ElementaryFunc((props) => {
  const size = 'h' + (props && props.size ? props.size : 1);

  return compose(makeHTMLElement(size), {
    style: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily,
      margin: theme.spacing,
    }
  });
});

const FlexContainer = ElementaryFunc((props) => (
  div({
    style: {
      display: 'flex',
      flexDirection: props.flexDirection || 'row',
      ...props.style,
    }
  })
));

const FlexItem = ElementaryFunc((props) => (
  div({
    style: {
      margin: theme.spacing,
      padding: theme.spacing,
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
};
