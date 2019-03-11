import { ElementaryFunc } from '../../elementary.js';
import { div, a, table, tr, th, td } from '../../elementary.js';

import { FlexContainer, FlexItem } from '../../cake.js';

const DataViewer = ElementaryFunc((props) => {
  var data = localStorage.getItem('records');
  if (!data) {
    return null;
  }

  data = JSON.parse(data);

  return table(
    tr(props.categories.map(cat => th({ style: { color: props.theme.colors.primary } }, cat))),
    tr(props.categories.map(cat => td({ style: { color: props.theme.colors.primary } },
                                      data[cat] ? data[cat].toString() : '0')))
  );
});

export default DataViewer;
