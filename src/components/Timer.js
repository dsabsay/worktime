import { Elementary, Extend } from '../../elementary.js';
import { div, p } from '../../elementary.js';

import { Heading, FlexContainer, FlexItem, Button } from '../../cake.js';
import RingPicker from './RingPicker.js';
import { theme } from '../globals.js'

function isSameDay(d1, d2) {
  return (d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate());
}

function merge(base, delta) {
  const o = JSON.parse(JSON.stringify(base));
  Object.keys(delta).map(key => o[key] = delta[key]);

  return o;
}

const Timer = (props) => Extend(Elementary, {
  initState: function() {
    console.log('initState');
    this.state = {
      isRecording: false,
      lastChangeDate: new Date(),
      currentCategory: null,
      records: this.loadRecords() || {},
    };
  },

  start: function() {
    this.changeState({
      isRecording: true,
      lastChangeDate: new Date(),
    });
  },

  saveRecords: function(records) {
    localStorage.setItem('records', JSON.stringify(records));
  },

  loadRecords: function() {
    return JSON.parse(localStorage.getItem('records'));
  },

  stop: function() {
    // Compute time since last change and add to total
    const now = new Date();
    const delta = now - this.state.lastChangeDate;  // in ms
    const prevTotal = this.state.records[this.state.currentCategory] || 0;
    const total = prevTotal + delta;

    const newRecords = merge(
      this.state.records,
      { [this.state.currentCategory]: total }
    );

    this.changeState({
      records: newRecords,
      isRecording: false,
    });

    this.saveRecords(newRecords);
  },

  handleClickRecord: function() {
    const now = new Date();

    if (!isSameDay(this.state.lastChangeDate, now)) {
      this.changeState({
        lastChangeDate: new Date(),
        isRecording: !this.state.isRecording,
        records: {},
      });
      this.saveRecords(this.state.records);
      alert(`It's a new day! Records cleared.`);

      return;
    }

    this.state.isRecording ? this.stop() : this.start();
  },

  handleCategorySelect: function(item) {
    console.log(`category selected: ${item}`);

    if (!this.state.isRecording) {
      this.changeState({
        currentCategory: item,
        lastChangeDate: new Date(),
      });
    } else if (this.state.isRecording) {
      this.stop();  // this saves the time elapsed

      this.changeState({
        currentCategory: item,
        lastChangeDate: new Date(),
        isRecording: true,
      });
    }
  },

  render: function() {
    return div({ style: { width: '100%' }},
      FlexContainer({ flexDirection: 'column', style: { alignItems: 'center' } },
        FlexItem(
          Button({
            id: 'start-button',
            label: this.state.isRecording ? 'Recording... (click to stop)' : 'Start',
            onClick: this.handleClickRecord,
            color: this.state.isRecording ? '#ff6e6e' : theme.colors.accent,
          }),
        ),
        FlexItem({ flex: '1 1 auto' },
          RingPicker({
            id: 'my-ring-picker',
            onSelect: this.handleCategorySelect,
            items: this.props.categories,
          })
        )
      )
    );
  }
}, props);

export default Timer;
