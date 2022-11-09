import produce from 'immer';
import { combineReducers } from 'redux';
import { ISetCloseSyncViewIdAction, ISetGridViewHoverFieldIdAction } from '../../../../../../exports/store/actions';
import {
  CHANGE_WIDGET_PANEL_WIDTH, SET_ACTIVE_ROW_INFO, SET_EDIT_STATUS, SET_GANTT_DATE_UNIT_TYPE, SET_GANTT_GRID_WIDTH, SET_GANTT_SETTING_PANEL_WIDTH,
  SET_GRID_VIEW_HOVER_FIELD_ID, SET_GROUPING_COLLAPSE, SET_KANBAN_GROUPING_EXPAND, SET_LOADING_RECORD,
  SET_NEW_RECORD_EXPECT_INDEX, SET_SEARCH_KEYWORD,
  SET_CALENDAR_SETTING_PANEL_WIDTH, TOGGLE_CALENDAR_SETTING_PANEL,
  SET_SEARCH_RESULT_CURSOR_INDEX, SWITCH_ACTIVE_PANEL, SET_CALENDAR_GRID_WIDTH, TOGGLE_CALENDAR_GUIDE_STATUS,
  TOGGLE_GANTT_GRID, TOGGLE_GANTT_SETTING_PANEL, TOGGLE_WIDGET_PANEL, TOGGLE_CALENDAR_GRID, SET_WIDGET_PANEL_LOADING, SET_HIGHLIGHT_FIELD_ID,
  CLEAR_ACTIVE_ROW_INFO,
  SET_CLOSE_SYNC_VIEW_ID, SET_ROBOT_PANEL_STATUS, SET_ORG_CHART_GRID_WIDTH, SET_ORG_CHART_SETTING_PANEL_WIDTH, TOGGLE_ORG_CHART_GRID,
  TOGGLE_ORG_CHART_GUIDE_STATUS, TOGGLE_ORG_CHART_SETTING_PANEL, ACTIVE_OPERATE_VIEW_ID, RESET_OPERATE_VIEW_ID,
  ACTIVE_EXPORT_VIEW_ID, RESET_EXPORT_VIEW_ID,
  TOGGLE_TIME_MACHINE_PANEL,
  TOGGLE_KANBAN_GROUP_SETTING_VISIBLE
} from '../../../../../shared/store/action_constants';
import { DateUnitType, WhyRecordMoveType } from '../../../../../shared/store/constants';
import {
  IActiveRowInfo, ICalendarViewStatus, IDatasheetClientState, IGanttViewStatus, IKanbanViewStatus, ILoadingRecord, ILoadingRecordAction, 
  IOrgChartViewStatus, IWidgetPanelStatus
} from '../../../../../../exports/store/interfaces';
import { collaborators } from './collaborators';
import { gridViewActiveFieldState } from './grid_view_active_field';
import { gridViewDragState } from './grid_view_drag';
import { selection } from './selection';

const defaultActiveRowInfo: IActiveRowInfo = {
  type: WhyRecordMoveType.UpdateRecord,
  positionInfo: {
    fieldId: '',
    recordId: '',
    visibleRowIndex: 0,
    isInit: true,
  },
  recordSnapshot: { meta: { fieldMap: {}}, recordMap: {}},
};

const MIN_WIDGET_PANEL_WIDTH = 320;

export const defaultWidgetPanelStatus: IWidgetPanelStatus = {
  opening: false,
  width: MIN_WIDGET_PANEL_WIDTH,
  activePanelId: null,
  loading: false,
};

export const defaultGanttViewStatus: IGanttViewStatus = {
  gridWidth: 256,
  gridVisible: true,
  settingPanelWidth: MIN_WIDGET_PANEL_WIDTH,
  settingPanelVisible: true,
  dateUnitType: DateUnitType.Month,
};

export const defaultCalendarViewStatus: ICalendarViewStatus = {
  // whether the first guide is completed
  guideStatus: false,
  gridWidth: 256,
  gridVisible: false,
  settingPanelVisible: true,
  settingPanelWidth: MIN_WIDGET_PANEL_WIDTH,
};

export const defaultOrgChartViewStatus: IOrgChartViewStatus = {
  guideStatus: false,
  rightPanelWidth: 256,
  rightPanelVisible: true,
  settingPanelVisible: false,
  settingPanelWidth: MIN_WIDGET_PANEL_WIDTH,
};

export const defaultKanbanViewStatus: IKanbanViewStatus = {
  groupSettingVisible: false,
};

export const client = combineReducers<IDatasheetClientState>({
  gridViewDragState,
  gridViewActiveFieldState,
  selection,
  collaborators,
  newRecordExpectIndex: (state = null, action) => {
    if (action.type === SET_NEW_RECORD_EXPECT_INDEX) {
      return action.payload;
    }
    return state;
  },
  activeRowInfo: (state = defaultActiveRowInfo, action) => {
    if (action.type === SET_ACTIVE_ROW_INFO) {
      return action.payload;
    }
    if (action.type === CLEAR_ACTIVE_ROW_INFO) {
      return null;
    }
    return state;
  },
  searchResultCursorIndex: (state = 0, action) => {
    if (action.type === SET_SEARCH_RESULT_CURSOR_INDEX) {
      return action.payload;
    }
    return state;
  },
  searchKeyword: (state = '', action) => {
    if (action.type === SET_SEARCH_KEYWORD) {
      return action.payload;
    }
    return state;
  },
  groupingCollapseIds: (state = [], action) => {
    if (action.type === SET_GROUPING_COLLAPSE) {
      return action.payload;
    }
    return state;
  },
  kanbanGroupCollapse: (state = [], action) => {
    if (action.type === SET_KANBAN_GROUPING_EXPAND) {
      return action.payload;
    }
    return state;
  },
  isEditingCell: (state = null, action) => {
    if (action.type === SET_EDIT_STATUS) {
      return action.payload;
    }
    return state;
  },
  loadingRecord: produce((state = {}, action: ILoadingRecordAction): ILoadingRecord => {
    if (action.type === SET_LOADING_RECORD) {
      const { recordIds, loading } = action.payload;
      recordIds.forEach(recordId => {
        state[recordId] = loading;
      });
    }
    return state;
  }),
  widgetPanelStatus: (state: IWidgetPanelStatus = defaultWidgetPanelStatus, action): IWidgetPanelStatus => {
    switch (action.type) {
      case TOGGLE_WIDGET_PANEL: {
        return {
          ...state,
          opening: action.payload == null ? !state.opening : action.payload,
        };
      }
      case CHANGE_WIDGET_PANEL_WIDTH: {
        return {
          ...state,
          width: Math.max(action.payload, MIN_WIDGET_PANEL_WIDTH),
        };
      }
      case SWITCH_ACTIVE_PANEL: {
        return {
          ...state,
          activePanelId: action.payload,
        };
      }
      case SET_WIDGET_PANEL_LOADING: {
        return {
          ...state,
          loading: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  },
  ganttViewStatus: (state: IGanttViewStatus = defaultGanttViewStatus, action): IGanttViewStatus => {
    switch (action.type) {
      case TOGGLE_GANTT_GRID: {
        return {
          ...state,
          gridVisible: action.payload == null ? !state.gridVisible : action.payload,
        };
      }
      case SET_GANTT_GRID_WIDTH: {
        return {
          ...state,
          gridWidth: action.payload,
        };
      }
      case TOGGLE_GANTT_SETTING_PANEL: {
        return {
          ...state,
          settingPanelVisible: action.payload == null ? !state.settingPanelVisible : action.payload,
        };
      }
      case SET_GANTT_SETTING_PANEL_WIDTH: {
        return {
          ...state,
          settingPanelWidth: action.payload,
        };
      }
      case SET_GANTT_DATE_UNIT_TYPE: {
        return {
          ...state,
          dateUnitType: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  },
  calendarViewStatus: (state: ICalendarViewStatus = defaultCalendarViewStatus, action): ICalendarViewStatus => {
    switch (action.type) {
      case TOGGLE_CALENDAR_GUIDE_STATUS: {
        return {
          ...state,
          guideStatus: action.payload == null ? !state.guideStatus : action.payload,
        };
      }
      case TOGGLE_CALENDAR_GRID: {
        return {
          ...state,
          gridVisible: action.payload == null ? !state.gridVisible : action.payload,
        };
      }
      case SET_CALENDAR_GRID_WIDTH: {
        return {
          ...state,
          gridWidth: action.payload,
        };
      }
      case TOGGLE_CALENDAR_SETTING_PANEL: {
        return {
          ...state,
          settingPanelVisible: action.payload == null ? !state.settingPanelVisible : action.payload,
        };
      }
      case SET_CALENDAR_SETTING_PANEL_WIDTH: {
        return {
          ...state,
          settingPanelWidth: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  },
  orgChartViewStatus: (state: IOrgChartViewStatus = defaultOrgChartViewStatus, action): IOrgChartViewStatus => {
    switch (action.type) {
      case TOGGLE_ORG_CHART_GUIDE_STATUS: {
        return {
          ...state,
          guideStatus: action.payload == null ? !state.guideStatus : action.payload,
        };
      }
      case TOGGLE_ORG_CHART_GRID: {
        return {
          ...state,
          rightPanelVisible: action.payload == null ? !state.rightPanelVisible : action.payload,
        };
      }
      case SET_ORG_CHART_GRID_WIDTH: {
        return {
          ...state,
          rightPanelWidth: action.payload,
        };
      }
      case TOGGLE_ORG_CHART_SETTING_PANEL: {
        return {
          ...state,
          settingPanelVisible: action.payload == null ? !state.settingPanelVisible : action.payload,
        };
      }
      case SET_ORG_CHART_SETTING_PANEL_WIDTH: {
        return {
          ...state,
          settingPanelWidth: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  },
  kanbanViewStatus: (state: IKanbanViewStatus = defaultKanbanViewStatus, action): IKanbanViewStatus => {
    switch (action.type) {
      case TOGGLE_KANBAN_GROUP_SETTING_VISIBLE: {
        return {
          ...state,
          groupSettingVisible: action.payload == null ? !state.groupSettingVisible : action.payload,
        };
      }
    }
    return state;
  },
  gridViewHoverFieldId(state = null, action: ISetGridViewHoverFieldIdAction) {
    switch (action.type) {
      case SET_GRID_VIEW_HOVER_FIELD_ID: {
        return action.payload;
      }
    }
    return state;
  },
  highlightFiledId(state = null, action) {
    if (action.type === SET_HIGHLIGHT_FIELD_ID) {
      return action.payload;
    }
    return state;
  },
  closeSyncViewIds(state = [], action: ISetCloseSyncViewIdAction) {
    switch (action.type) {
      case SET_CLOSE_SYNC_VIEW_ID: {
        if (!state) {
          return [action.payload];
        }
        if (state.includes(action.payload)) {
          return state.filter(item => item !== action.payload);
        }
        return [...state, action.payload];
      }
    }
    return state;
  },
  isRobotPanelOpen(state = false, action) {
    if (action.type === SET_ROBOT_PANEL_STATUS) {
      return action.payload;
    }
    return state;
  },
  operateViewIds(state = null, action) {
    const viewId = action.payload;
    if (action.type === ACTIVE_OPERATE_VIEW_ID) {
      if (!state) {
        return [viewId];
      }
      state.push(viewId);
      return state;
    }
    if (action.type === RESET_OPERATE_VIEW_ID) {
      if (!state) {
        return state;
      }
      return state.filter(item => item !== viewId);
    }

    return state;
  },
  isTimeMachinePanelOpen(state = false, action) {
    if (action.type === TOGGLE_TIME_MACHINE_PANEL) {
      if (action.payload != null) {
        return action.payload;
      }
      return !state;
    }
    return state;
  },
  exportViewId(state = null, action) {
    if (action.type === ACTIVE_EXPORT_VIEW_ID) {
      const viewId = action.payload;
      return viewId;
    }
    if (action.type === RESET_EXPORT_VIEW_ID) {
      return null;
    }
    return state;
  }
});
