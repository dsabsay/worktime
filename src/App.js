import { Elementary, Extend } from '../elementary.js';
import { div } from '../elementary.js';

import { Heading, FlexContainer, FlexItem, Button } from '../cake.js';
import Timer from './components/Timer.js';

const App = (props) => Extend(Elementary, {
  init: function() {
  },

  render: function() {
    return div({ style: { width: '100%' }},
      FlexContainer({ flexDirection: 'column', style: { alignItems: 'center' } },
        FlexItem(
          Heading('Worktime')
        ),
        FlexItem(Timer({
          categories: ['Meetings', 'Coding', 'Education', 'Email/Slack', 'Miscellaneous']
        })
        )
      )
    );
  }
});

export default App;
