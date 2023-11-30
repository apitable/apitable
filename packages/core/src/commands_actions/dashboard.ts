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

import { IDashboardLayout, IDashboardSnapshot } from '../exports/store/interfaces';
import { IJOTAction } from 'engine';
import { OTActionName } from '../engine/ot';

export class DashboardAction {
  // install widget
  static addWidget2Action(
    snapshot: IDashboardSnapshot,
    options: {
      layout: IDashboardLayout[];
    },
  ): IJOTAction[] | null {
    const widgetInstallations = snapshot.widgetInstallations;
    const widgetCount = widgetInstallations.layout?.length;
    const { layout } = options;
    if (!widgetCount) {
      // first join
      return [
        {
          n: OTActionName.ObjectInsert,
          p: ['widgetInstallations', 'layout'],
          oi: layout,
        },
      ];
    }

    const action: IJOTAction[] = [];

    layout.forEach((widget, index) => {
      action.push({
        n: OTActionName.ListInsert,
        p: ['widgetInstallations', 'layout', widgetCount + index],
        li: widget,
      });
    });

    return action;
  }

  // delete widget
  static deleteWidget2Action(snapshot: IDashboardSnapshot, widgetId: string): IJOTAction[] | null {
    const layout = snapshot.widgetInstallations.layout!;
    const layoutIndex = layout.findIndex(item => item.id === widgetId);

    return [
      {
        n: OTActionName.ListDelete,
        p: ['widgetInstallations', 'layout', layoutIndex],
        ld: layout[layoutIndex],
      },
    ];
  }

  // change the layout of widgets
  static changeWidgetLayout2Action(snapshot: IDashboardSnapshot, options: { layout: IDashboardLayout[] }): IJOTAction[] | null {
    const oldLayout = snapshot.widgetInstallations.layout;
    const { layout } = options;

    if (layout.length !== oldLayout?.length) {
      return null;
    }

    const actions: IJOTAction[] = [];

    oldLayout.map((oldPosition, index) => {
      const newPosition = layout[index]!;
      for (const k in oldPosition) {
        actions.push({
          n: OTActionName.ObjectReplace,
          p: ['widgetInstallations', 'layout', index, k],
          oi: newPosition[k],
          od: oldPosition[k],
        });
      }
    });
    return actions;
  }
}
