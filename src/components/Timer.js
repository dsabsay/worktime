import { Elementary, Extend } from '../../elementary.js';
import { div } from '../../elementary.js';

import { Heading, FlexContainer, FlexItem, Button } from '../../cake.js';
import RingPicker from './RingPicker.js';

function isSameDay(d1, d2) {
  return (d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate());
}

const Timer = (props) => Extend(Elementary, {
  init: function() {
    this.state = {
      isRecording: false,
      lastChangeDate: new Date(),
      currentCategory: null,
      records: {},
    };
  },

  handleClickRecord: function() {
    const now = new Date();

    if (!isSameDay(this.state.lastChangeDate, now)) {
      this.changeState({
        lastChangeDate: new Date(),
        isRecording: !this.state.isRecording,
        records: {},
      });
      return;
    }

    this.changeState({
      lastChangeDate: new Date(),
      isRecording: !this.state.isRecording,
    });
  },

  handleCategorySelect: function(item) {
    console.log(`category selected: ${item}`);

    if (!this.state.isRecording) {
      this.changeState({
        currentCategory: item,
        lastChangeDate: new Date(),
      });
    } else if (this.state.isRecording) {
      // Compute time since last change and add to total
      const now = new Date();
      const delta = now - this.state.lastChangeDate;  // in ms
      const prevTotal = this.state.records[this.state.currentCategory] || 0;
      const total = prevTotal + delta;

      this.changeState({
        currentCategory: item,
        lastChangeDate: now,
        records: {
          [item]: total
        }
      })
    }
  },

  render: function() {
    return div({ style: { width: '100%' }},
      FlexContainer({ flexDirection: 'column', style: { alignItems: 'center' } },
        FlexItem(Button({
          label: this.state.isRecording ? 'Stop' : 'Start',
          onClick: this.handleClickRecord
        })),
        FlexItem({ flex: '1 1 auto' },
          RingPicker({
            onSelect: this.handleCategorySelect,
            items: this.props.categories,
          })
        )
      )
    );
  }
}, props);

export default Timer;
