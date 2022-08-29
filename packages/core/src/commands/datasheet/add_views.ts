import { isEmpty } from 'lodash';
import { IJOTAction, jot } from 'engine/ot';
import { DatasheetActions } from 'model';
import { IViewProperty, SubscribeKye } from 'store/interface';
import { Selectors, ViewType } from 'store';
import { Strings, t } from 'i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

export interface IAddView {
  startIndex: number;
  view: IViewProperty;
}

export interface IAddViewsOptions {
  cmd: CollaCommandName.AddViews;
  data: IAddView[];
}

export const addViews: ICollaCommandDef<IAddViewsOptions> = {

  undoable: true,

  execute: (context, options) => {
    const { model: state, subscribeUsageCheck } = context;
    const { data } = options;
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }
    const views = snapshot.meta.views;

    if (isEmpty(data)) {
      return null;
    }

    const checkViewCount = (viewType: ViewType) => {
      const spaceInfo = state.space.curSpaceInfo!;

      if(state.pageParams.shareId){
        return; 
      }
      
      switch (viewType) {
        case ViewType.Calendar: {
          subscribeUsageCheck(SubscribeKye.MaxCalendarViewsInSpace, spaceInfo['calendarViewNums'] + 1);
          return;
        }
        case ViewType.Gantt: {
          subscribeUsageCheck(SubscribeKye.MaxGanttViewsInSpace, spaceInfo['ganttViewNums'] + 1);
          return;
        }
        case ViewType.Kanban: {
          subscribeUsageCheck(SubscribeKye.MaxKanbanViewsInSpace, spaceInfo['kanbanViewNums'] + 1);
          return;
        }
        case ViewType.Gallery: {
          subscribeUsageCheck(SubscribeKye.MaxGalleryViewsInSpace, spaceInfo['galleryViewNums'] + 1);
          return;
        }
      }
    };

    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { startIndex, view } = recordOption;

      // 检查viewId是否存在,
      // 新增的viewid不应和目前以后的id冲突
      if (views.findIndex(item => item.id === view.id) !== -1) {
        throw new Error(t(Strings.error_create_view_failed_duplicate_view_id));
      }
      checkViewCount(view.type);
      const action = DatasheetActions.addView2Action(snapshot, { startIndex, view });

      if (!action) {
        return collected;
      }

      if (collected.length) {
        const transformedAction = jot.transform([action], collected, 'right');
        collected.push(...transformedAction);
      } else {
        collected.push(action);
      }

      return collected;
    }, []);

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IAddViewOptions & { cmd: 'AddViews' });
 }
 }

 */
