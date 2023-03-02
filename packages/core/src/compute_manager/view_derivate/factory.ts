import { assertNever } from 'utils';
import { setViewDerivation } from 'exports/store/actions';
import { IReduxState } from 'exports/store/interfaces';
import { getActiveViewId, getViewInNode } from 'exports/store/selectors';
import { ViewDerivateBase } from './view_derivate_base';
import { ViewDerivateCalendar } from './view_derivate_calendar';
import { ViewDerivateGallery } from './view_derivate_gallery';
import { ViewDerivateGantt } from './view_derivate_gantt';
import { ViewDerivateGrid } from './view_derivate_grid';
import { ViewDerivateKanban } from './view_derivate_kanban';
import { ViewDerivateOrgChart } from './view_derivate_org_chart';
import { MiddlewareAPI, AnyAction, Dispatch } from 'redux';
import { ViewType } from 'modules/shared/store/constants';

export class ViewDerivateFactory {
  static createViewDerivate(state: IReduxState, datasheetId: string, viewType: ViewType): ViewDerivateBase {
    switch(viewType) {
      case ViewType.Calendar:
        return new ViewDerivateCalendar(state, datasheetId);
      case ViewType.Gallery:
        return new ViewDerivateGallery(state, datasheetId);
      case ViewType.Gantt:
        return new ViewDerivateGantt(state, datasheetId);
      case ViewType.Grid:
        return new ViewDerivateGrid(state, datasheetId);
      case ViewType.Kanban:
        return new ViewDerivateKanban(state, datasheetId);
      case ViewType.OrgChart:
        return new ViewDerivateOrgChart(state, datasheetId);
      case ViewType.NotSupport:
        // Old client renders unsupported views as table views by default
        return new ViewDerivateGrid(state, datasheetId);
      case ViewType.Form:
        throw new Error('Form view is should not be derivate');
    }
    assertNever(viewType);
  }
}

export const dispatchNewViewDerivation = (
  store: MiddlewareAPI<Dispatch<AnyAction>, IReduxState>,
  datasheetId: string,
  viewId?: string
) => {
  const state = store.getState();
  const currentViewId = getActiveViewId(state);
  const view = getViewInNode(state, datasheetId, viewId || currentViewId);
  if (!view || !view.rows) {
    return;
  }

  const timeStart = Date.now();
  const viewDerivate = ViewDerivateFactory.createViewDerivate(state, datasheetId, view.type);
  const viewDerivation = viewDerivate.getViewDerivation(view);
  console.log('DERIVATE: calcViewDerivation %s  %s cost: %s ms', datasheetId, view.id, Date.now() - timeStart);
  store.dispatch(setViewDerivation(datasheetId, {
    viewId: view.id,
    viewDerivation,
  }));
};
