import { Elementary, Extend, Route } from '../elementary.js';
import { div, a } from '../elementary.js';

import { Heading, FlexContainer, FlexItem, Button } from '../cake.js';
import Timer from './components/Timer.js';
import DataViewer from './components/DataViewer.js';

const CATEGORIES = ['Meetings', 'Coding', 'Education', 'Email/Slack', 'Miscellaneous'];

const App = (props) => Extend(Elementary, {
  initState: function() {
    return;
  },

  render: function() {
    return div({ style: { width: '100%' }},
      FlexContainer({ flexDirection: 'column', style: { alignItems: 'center' } },
        FlexItem(
          Heading('Worktime')
        ),
        Route(
          '/',
          FlexItem(
            Timer({
              id: 'my-timer',
              categories: CATEGORIES,
            })
          ),
          FlexItem(
            a('Data', { href: '/data' })
          )
        ),
        Route(
          '/data',
          FlexItem(DataViewer( { categories: CATEGORIES })),
          FlexItem(a('Timer', { href: '/' })),
        )
      )
    );
  }
}, props);

export default App;
