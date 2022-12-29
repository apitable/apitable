import { IReduxState, Selectors } from "@apitable/core";

export const mockGetViewInfo = (dstId: string, viewId: string) => (state: IReduxState) => {
  const snapshot = Selectors.getSnapshot(state, dstId);
  const view = snapshot.meta.views.find(view => view.id === viewId);
  return {
    viewId,
    rows: view.rows,
    columns: view.columns,
    fieldMap: snapshot.meta.fieldMap,
  };
};