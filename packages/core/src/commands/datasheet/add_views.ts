/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { IJOTAction, jot } from 'engine/ot';
import { Strings, t } from '../../exports/i18n';
import { isEmpty } from 'lodash';
import { DatasheetActions } from 'commands_actions/datasheet';
import { getActiveDatasheetId, getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { IViewProperty } from '../../exports/store/interfaces';
import { ResourceType } from 'types';

export interface IAddView {
  startIndex?: number;
  view: IViewProperty;
}

export interface IAddViewsOptions {
  cmd: CollaCommandName.AddViews;
  data: IAddView[];
}

export const addViews: ICollaCommandDef<IAddViewsOptions> = {

  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }
    const views = snapshot.meta.views;

    if (isEmpty(data)) {
      return null;
    }

    // const checkViewCount = (viewType: ViewType) => {
    //   const spaceInfo = state.space.curSpaceInfo!;
    //
    //   if(state.pageParams.shareId){
    //     return;
    //   }
    //
    //   switch (viewType) {
    //     case ViewType.Calendar: {
    //       subscribeUsageCheck('maxCalendarViewsInSpace', spaceInfo['calendarViewNums'] + 1);
    //       return;
    //     }
    //     case ViewType.Gantt: {
    //       subscribeUsageCheck('maxGanttViewsInSpace', spaceInfo['ganttViewNums'] + 1);
    //       return;
    //     }
    //     case ViewType.Kanban: {
    //       subscribeUsageCheck('maxKanbanViewsInSpace', spaceInfo['kanbanViewNums'] + 1);
    //       return;
    //     }
    //     case ViewType.Gallery: {
    //       subscribeUsageCheck('maxGalleryViewsInSpace', spaceInfo['galleryViewNums'] + 1);
    //       return;
    //     }
    //   }
    // };

    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { startIndex, view } = recordOption;

      // Check if viewId exists,
      // The newly added viewid should not conflict with the current and future ids
      if (views.findIndex(item => item.id === view.id) !== -1) {
        throw new Error(t(Strings.error_create_view_failed_duplicate_view_id));
      }
      // checkViewCount(view.type);
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
