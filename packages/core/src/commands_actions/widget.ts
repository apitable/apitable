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

import { IJOTAction, OTActionName } from 'engine/ot/interface';
import { IWidgetSnapshot } from '../exports/store/interfaces';

export class WidgetActions {
  static setGlobalStorage2Action(
    snapshot: IWidgetSnapshot,
    payload: {
      key: string,
      value?: any
    },
  ): IJOTAction[] | null {
    const { storage } = snapshot;
    const { value, key } = payload;

    // if exists, then overwrite.
    // if not exists, then insert.
    // if value is null, then delete
    if (storage && Object.keys(storage).includes(key)) {
      return [{
        n: OTActionName.ObjectReplace,
        p: ['storage', key],
        oi: value,
        od: storage[key],
      }];
    }
    return [{
      n: OTActionName.ObjectInsert,
      p: ['storage', key],
      oi: value,
    }];
  }

  static setWidgetName2Action(
    snapshot: IWidgetSnapshot,
    payload: {
      newWidgetName: string;
    },
  ): IJOTAction[] | null {
    const { newWidgetName } = payload;
    return [
      {
        n: OTActionName.ObjectReplace,
        p: ['widgetName'],
        od: snapshot.widgetName,
        oi: newWidgetName,
      },
    ];
  }

  static setWidgetDepDstId2Action(
    snapshot: IWidgetSnapshot,
    payload: {
      dstId: string;
      sourceId?: string
    },
  ): IJOTAction[] | null {
    const { dstId, sourceId } = payload;
    const action: IJOTAction[] = [
      {
        n: OTActionName.ObjectReplace,
        p: ['datasheetId'],
        od: snapshot.datasheetId,
        oi: dstId,
      }
    ];
    if (sourceId) {
      action.push({
        n: OTActionName.ObjectReplace,
        p: ['sourceId'],
        od: snapshot.sourceId,
        oi: sourceId,
      });
    }
    return action;
  }
}
