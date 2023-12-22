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

import { CollaCommandName } from 'commands/index';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { Strings, t } from '../../exports/i18n';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IMirrorSnapshot, ISnapshot, IWidgetPanel } from 'exports/store/interfaces';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { getMirrorSnapshot } from 'modules/database/store/selectors/resource/mirror';
import { ResourceType } from 'types';
import { getNewId, getUniqName, IDPrefix } from 'utils';

export interface IAddWidgetPanel {
  cmd: CollaCommandName.AddWidgetPanel;
  resourceId: string;
  resourceType: ResourceType.Datasheet | ResourceType.Mirror;
}

export const addWidgetPanel: ICollaCommandDef<IAddWidgetPanel> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IAddWidgetPanel) {
    const { state: state } = context;
    const { resourceId, resourceType } = options;
    const snapshot = resourceType === ResourceType.Datasheet ? getSnapshot(state, resourceId)! : getMirrorSnapshot(state, resourceId)!;
    const widgetPanels = (resourceType === ResourceType.Datasheet ? (snapshot as ISnapshot).meta.widgetPanels :
      (snapshot as IMirrorSnapshot).widgetPanels) || [];

    const panelCount = widgetPanels.length;

    if (panelCount > 2) {
      return null;
    }

    const existPanelIds = widgetPanels.map(item => {
      return item.id;
    });

    const existPanelName = widgetPanels.map(item => {
      return item.name;
    });

    const newPanelId = getNewId(IDPrefix.WidgetPanel, existPanelIds);

    const newPanelName = getUniqName(t(Strings.widget_panel), existPanelName);

    const generateStdValue = (id: string, name: string): IWidgetPanel => {
      return {
        name,
        id: id,
        widgets: [],
      };
    };

    const addWidgetPanelAction = resourceType === ResourceType.Datasheet ?
      DatasheetActions.addWidgetPanel2Action(snapshot as ISnapshot, generateStdValue(newPanelId, newPanelName)) :
      DatasheetActions.addWidgetPanelWithMirror2Action(snapshot as IMirrorSnapshot, generateStdValue(newPanelId, newPanelName));

    if (!addWidgetPanelAction) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: addWidgetPanelAction,
      data: {
        panelId: newPanelId,
      },
    };
  },
};
