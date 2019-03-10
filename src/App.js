import { Elementary, Extend, Route } from '../elementary.js';
import { div, a } from '../elementary.js';

import { Heading, FlexContainer, FlexItem, Button, Toggle } from '../cake.js';
import Timer from './components/Timer.js';
import DataViewer from './components/DataViewer.js';
import { theme, lightTheme, darkTheme } from './globals.js'

const CATEGORIES = ['Meetings', 'Coding', 'Creative', 'Education', 'Email/Slack', 'Other'];
const HOME = window.location.hostname === 'dsabsay.github.io' ? '/worktime' : '';

const App = (props) => Extend(Elementary, {
  initState: function() {
    this.state = {
      isDarkMode: false,
    };
  },

  handleDarkModeToggle: function() {
    // TODO: toggle dark mode
    theme = this.state.isDarkMode ? lightTheme : darkTheme;
    this.changeState({
      isDarkMode: !this.state.isDarkMode,
    });
  },

  render: function() {
    return div({ style: { width: '100%' }},
      FlexContainer({ flexDirection: 'column', style: { alignItems: 'center' } },
        FlexItem(
          Heading('Worktime')
        ),
        FlexItem(
          Toggle({
            id: 'my-toggle',
            onToggle: this.handleDarkModeToggle,
          }),
        ),
        Route(
          HOME + '/',
          FlexItem(
            Timer({
              id: 'my-timer',
              categories: CATEGORIES,
            })
          ),
          FlexItem(
            a('Data', { href: HOME + '/data' })
          )
        ),
        Route(
          HOME + '/data',
          FlexItem(DataViewer( { categories: CATEGORIES })),
          FlexItem(a('Timer', { href: HOME + '/' })),
        )
      )
    );
  }
}, props);

export default App;
