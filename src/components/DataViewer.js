import { ElementaryFunc } from '../../elementary.js';
import { div, a, table, tr, th, td } from '../../elementary.js';

import { FlexContainer, FlexItem, scaleRem } from '../../cake.js';

const DataViewer = ElementaryFunc((props) => {
  const keys = Array(localStorage.length).fill().map((_, i) => localStorage.key(i));
  const data = keys.reduce((acc, cur) => {
    acc[cur] = JSON.parse(localStorage.getItem(cur));
    return acc;
  }, {});

  if (!data) {
    return null;
  }

  return table(
    { style: { color: props.theme.colors.primary } },
    tr(
      th('Date', { style: { textAlign: 'left' } }),
      props.categories.map(cat => th({ style: { paddingRight: props.theme.spacing } }, cat))),
      Object.keys(data).map(key => (
        tr(
          td(key, { style: { paddingRight: scaleRem(props.theme.spacing, 3) } }),
          props.categories.map(cat => (
            td(data[key][cat] ? data[key][cat].toString() : '0')
          ))
        )
      )),
  );
});

export default DataViewer;
