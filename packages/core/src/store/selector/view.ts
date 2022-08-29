import { createSelector } from 'reselect';
import { getCurrentView } from './resource';

export const getColumnCount = createSelector([getCurrentView], view => {
  if (!view) return;
  return view.columns.length;
});
