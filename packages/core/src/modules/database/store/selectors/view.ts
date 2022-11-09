import { createSelector } from 'reselect';
import { getCurrentView } from './resource';

export const getColumnCount = createSelector([getCurrentView], (view: any) => {
  if (!view) return;
  return view.columns.length;
});
