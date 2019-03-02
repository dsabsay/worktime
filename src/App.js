import { div, a, h1, p } from '../elementary.js';

const App = props => (
  div(
    h1('Hello, world!'),
    p('This is some descriptive text.'),
    a('Link to Google', { href: 'https://www.google.com' })
  )
);

export default App;
