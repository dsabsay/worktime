import { Elementary, Extend } from '../elementary.js';
import { div, a, h1, h2, p, button, img, br } from '../elementary.js';
import { theme, FlexContainer, FlexItem, Heading, Button, Card, Box } from '../cake.js';

const ImageBox = props => Extend(Elementary, {
  init: function() {},
  render: function() {
    return div(
      img({ src: this.props.src, width: 500 })
    );
  }
}, props);

const App = (...args) => Extend(Elementary, {
  init: function() {
    this.state = { title: 'hi' }
  },

  handleClick: function() {
    this.changeState({
      title: 'Goodbye.',
    });
  },

  render: function() {
    return div(
      Heading(this.state.title),
      FlexContainer(
        FlexItem({ flex: '1 1 auto', style: { backgroundColor: theme.colors.secondary } },
          Heading({ size: 2 }, 'Sidebar'),
          a('Link to Google', { href: 'https://www.google.com' }),
          br(),
          a('Link to localhost:4000', { href: 'http://localhost:4000' })
        ),
        FlexItem({ flex: '9 1 auto' },
          p('This is some descriptive text.'),
          ImageBox({ src: 'IMG_7375.jpg' }),
          button('Click me', { onclick: this.handleClick }),
          Button({ label: 'Click me too' }),
          br(),
          Card({
            text: 'This is a wiggling card',
            onMouseOverTransition: {
              transitionDuration: '1s',
              transitionProperty: 'transform',
              transform: 'rotate(5deg)',
            }}
          ),
          FlexContainer({ flexDirection: 'column' },
            FlexItem(p('This is a flex item.')),
            FlexItem(p('This is another flex item.')),
            FlexItem(p('And another...'))
          ),
        )
      )
    );
  }
});

const AppFun = props => {
  var title = 'Hello, world!';

  function handleClick() {
    title = 'Goodbye.';
  }

  return div(
    h1('Hello, world!'),
    p('This is some descriptive text.'),
    a('Link to Google', { href: 'https://www.google.com' }),
    button('Click me', { onclick: this.handleClick }),
  );
}

export default App;
