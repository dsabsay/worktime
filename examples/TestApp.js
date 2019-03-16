import { ElementaryFunc, Extend, Elementary, div, p } from '../elementary.js';
import { Heading, Button, Toggle, FlexContainer, FlexItem } from '../cake.js';

const TestApp = (props) => Extend(Elementary, {
  initState: function() {
  },

  render: function() {
    return (
      div(
        { theme: {
          color: 'red',
          colors: {
            primary: '#353535',
            secondary: '#e2e2e2',
            background: 'white',
            accent: '#92cff3',
          }
        }},
        Heading('A test app'),
        ExampleFuncComp(
          p('This is a p element inside an ExampleFuncComp'),
          div(
          )
        ),
        div(
          { theme: { textColor: 'blue', backgroundColor: 'gray' } },
          ExampleFuncComp()
        ),
        ExampleFuncComp(
          { theme: { textColor: 'orange', backgroundColor: 'green' }}
        ),
        ExampleStatefulComp({ id: 'example-stateful-comp' }),
        FlexContainer(
          FlexItem(Toggle({ id: 'my-toggle-1' })),
          FlexItem(Toggle({ id: 'my-toggle-2' })),
          FlexItem(Toggle({ id: 'my-toggle-3' })),
        )
      )
    );
  }
}, props);

const ExampleStatefulComp = (props) => Extend(Elementary, {
  initState: function() {
    this.state = { message: 'Welcome' };
  },

  handleClick: function() {
    this.changeState({
      message: 'You clicked it'
    });
  },

  render: function() {
    return (
      div(
        { style: { textAlign: 'center' } },
        Heading({ size: 3 }, 'A (centered) stateful component'),
        p(`My state is: ${this.state.message}`),
        Button({ id: 'my-button', label: 'Click me', onClick: this.handleClick })
      )
    )
  }
}, props);

const ExampleFuncComp = ElementaryFunc((props) => (
  div(
    {
      style: {
        backgroundColor: props.theme.backgroundColor,
      }
    },
    Heading({ size: 2 }, 'Function Component'),
    p({ style: { color: props.theme.textColor } }, 'This is an example function component.'),
    div(
      { theme: { textColor: 'red' } },  // This theme does not cascade down to the p element
      p(
        'My theme comes from the props passed into ExampleFuncComp',
        { style: { color: props.theme.textColor, } }
      ),
      p(
        { style: { color: props.theme.colors.primary } },
        'My color comes from theme.colors.primary',
      ),
      p(
        { style: { color: props.theme.colors.secondary } },
        'My color comes from theme.colors.secondary',
      )
    )
  )
));

export default TestApp;
