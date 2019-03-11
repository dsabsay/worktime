import { Elementary, Extend } from '../../elementary.js';
import { div, svg, circle, text } from '../../elementary.js';

import { Heading, FlexContainer, FlexItem } from '../../cake.js';

/* Props:
 *   items: array of items to display
 */
const RingPicker = (props) => Extend(Elementary, {
  initState: function() {
    this.state = { chosen: null };
  },

  handleClick: function(item) {
    return () => {
      this.changeState({
        chosen: item,
      });
      this.props.onSelect(item);
    }
  },

  render: function() {
    const numItems = this.props.items.length;
    const step = (2 * Math.PI) / numItems;
    const r = Math.min(0.25, (2 * Math.PI) / (numItems * 3));
    const fontSize = r / 4;

    const items = this.props.items.map((item, index) => {
      return {
        x: Math.cos(step * index) * 0.75,
        y: Math.sin(step * index) * 0.75,
        r: r,
        name: item || '',
      };
    });

    console.log("this.props.theme: ", this.props.theme);

    return (
      svg({
        viewBox: `-1 -1 2 2`,
        style: {
          width: '100%',
          height: '100%',
        }},
        ...items.map(item => circle(
          {
            fill: this.state.chosen === item.name
              ? this.props.theme.colors.primary
              : this.props.theme.colors.secondary,
            r: item.r,
            cx: item.x,
            cy: item.y,
            onclick: this.handleClick(item.name),
            style: {
              cursor: 'pointer'
            }
          }
        )),
        ...items.map(item => text(item.name, {
          x: item.x,
          y: item.y,
          fill: this.props.theme.colors.background,
          'font-size': fontSize,
          'text-anchor': 'middle',
          'dominant-baseline': 'middle',
          style: {
            pointerEvents: 'none',
          }
        })),
      )
    );
  }
}, props);

export default RingPicker;
