import { ElementaryFunc, Extend, Elementary, makeElement, } from './elementary.js';
import { div, a, h1, h2, p, button, img, br } from '../elementary.js';

const theme = {
  colors: {
    primary: '#353535',
    secondary: '#e2e2e2',
    background: 'white',
    accent: '#92cff3',
  },
  fontFamily: 'sans-serif',
  spacing: '1rem',
};

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

const Box = (props) => Extend(Elementary, {

});

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
    node.style.backgroundColor = theme.colors.accent;
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
        backgroundColor: theme.colors.accent,
        cursor: 'pointer',
      }}
    );
  }
}, props);

const Heading = ElementaryFunc((props) => {
  const size = 'h' + (props.size || 1);

  return makeElement(size, {
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
      flex: props.flex || '0 1 auto',
      ...props.style,
    },
  })
));

export {
  theme,
  FlexContainer,
  FlexItem,
  Heading,
  Button,
  Card,
  Box,
};
