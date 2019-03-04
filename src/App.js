import { Elementary, Extend } from '../elementary.js';
import { div } from '../elementary.js';

import { Heading, FlexContainer, FlexItem, Button } from '../cake.js';
import Timer from './components/Timer.js';
import DataViewer from './components/DataViewer.js';

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
        FlexItem(
          Timer({
            id: 'my-timer',
            categories: ['Meetings', 'Coding', 'Education', 'Email/Slack', 'Miscellaneous']
          })
        ),
        FlexItem(DataViewer())
      )
    );
  }
}, props);

export default App;
