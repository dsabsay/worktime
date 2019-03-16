import { ElementaryFunc } from '../../elementary.js';
import { div, p, br, a, span, b } from '../../elementary.js';

import { Heading, FlexContainer, FlexItem, scaleRem } from '../../cake.js';

const About = ElementaryFunc((props) => {
  return FlexContainer(
    { flexDirection: 'column', alignItems: 'center', },
    div({ style: { maxWidth: '50%' } },
      Heading({ size: 3, style: { textAlign: 'center', marginBottom: props.theme.spacing } }, 'What is this?'),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        'Worktime is an experiment in both web development and time-tracking.'
      ),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `It allows you to easily track how much time you spend on different types
         of work each day.
        `
      ),
      Heading(
        { size: 3,
          style: {
            textAlign: 'center',
            marginBottom: props.theme.spacing,
            marginTop: scaleRem(props.theme.spacing, 2),
          }
        },
        'Great. How do I use it?'
      ),
      Heading({ size: 5 }, 'Track time with the Timer'),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `
        You record time by selecting a category
        and clicking the
        `,
        b('Start'),
        `
        button. When you're finished with a task, you can
        stop the recording by clicking the button again, or switch to a new category
        by simply selecting the new category without stopping the recording.
        `,
      ),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `
        Before you leave the Timer page, make sure you stop the recording to save the
        recorded time.
        `
      ),
      Heading({ size: 5 }, 'View time on the Data page'),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `
        The Data page will display all recorded time for each day. The data is stored
        in your browser's localStorage, which means that the data should persist
        even when you close the tab or navigate to a new page. However, the localStorage
        may still be cleared due to other events (browser updates, system reboots, etc.).
        So if you want to save your data, you should copy it to some external place.

        Since the data is displayed using HTML tables, it should be easy to copy
        and paste into a spreadsheet.
        `
      ),
      Heading(
        { size: 3,
          style: {
            textAlign: 'center',
            marginBottom: props.theme.spacing,
            marginTop: scaleRem(props.theme.spacing, 2),
          }
        },
        'You said it was a web development experiment?'
      ),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `
        Yes! This entire application (including the page you're viewing now) was
        built from the ground up without any third-party JavaScript libraries or
        frameworks. No fancy CSS frameworks either.
        `
      ),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `
        Essentially, the application is powered by a custom JavaScript UI
        framework that I built while developing this website. I'm calling it Elementary.
        `
      ),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `
        Elementary is a declarative, component-based framework that features unidirectional
        data flow, cascading themes for uniform styling, and supports stateful components
        with automatic view updates. All with just a few hundred lines of code.
        It's a simple implementation of many of the ideas made popular by the React framework.
        `
      ),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `
        The initial inspiration and many parts of Elementary's design came from
        David Gilbertson's vanilla JavaScript React implementation. He's written
        an excellent blog post about it
        `,
        a('here.', { href: 'https://hackernoon.com/how-i-converted-my-react-app-to-vanillajs-and-whether-or-not-it-was-a-terrible-idea-4b14b1b2faff'}),
        `
        I started the project referencing his work but extended and modified it to
        suit my own tastes. Elementary handles state differently, has a syntax for
        Stateful Components more akin to React's, supports routing and cascading theming,
        and is probably quite a bit slower and less efficient than David's implementation.
        `,
      ),
      p({ style: { margin: props.theme.spacing, color: props.theme.colors.primary } },
        `
        If you're curious, I highly recommend you go check out David's blog post.
        He's an excellent writer and you may even be inspired to go write your own
        UI framework! Whether you just read his article or go write your own framework,
        you'll learn a lot about what modern JavaScript UI frameworks do for you
        and gain an appreciation for all the hard work that has been put into them.
        `
      ),
    ),
  );
});

export default About;
