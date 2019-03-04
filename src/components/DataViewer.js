import { ElementaryFunc } from '../../elementary.js';
import { div } from '../../elementary.js';

const DataViewer = ElementaryFunc((props) => {
  const data = localStorage.getItem('records');

  return div(
    data
  );
});

export default DataViewer;
