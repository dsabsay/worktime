import { ElementaryFunc, Extend, Elementary, div, p } from '../elementary.js';

const TestApp2 = (props) => Extend(Elementary, {
  initState: function() {

  },

  render: function() {
    return (
      div(
        'TADA!!!!!!!',
        {
          theme: {
            color: 'red'
          }
        },
        TestApp('TestApp'),
        div(
          { theme: { color: 'blue' } },
          TestApp('blue TestApp')
        ),
      )
    );
  }
}, props);

const TestApp = ElementaryFunc((props) => (
  div(
    'div inside TestApp function component',
    // { theme: { color: 'red' }},
    // p({ test: 'hi', style: { color: props.theme.color } }, 'hello, world'),
    p({ style: { color: props.theme.color } }, 'hi again'),
    div(
      { theme: { color: 'blue' } },
      'div inside div inside TestApp',
      p(
        'I am inside another div',
        {
          style: {
            color: props.theme.color,
          }
        }
      ),
    )
  )
));

export default TestApp;
