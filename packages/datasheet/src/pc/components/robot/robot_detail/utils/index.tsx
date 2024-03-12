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

import React from 'react';
import { IRobotAction, IRobotTrigger } from '../../interface';

export const getActionList = (actions?: IRobotAction[]): IRobotAction[] => {
  if (!actions || actions.length === 0) {
    return [];
  }

  const preActionIdMap:Record<string, IRobotAction> = actions.map((action: IRobotAction) => ({
    [action.prevActionId]:  action,
  })).reduce((acc: any, item: any) => ({ ...acc, ...item }), {});

  const headOpt: IRobotAction|undefined = actions.find((item: IRobotAction) => item.prevActionId == null || item.prevActionId =='');
  if(!headOpt) {
    return [];
  }
  const head : IRobotAction= headOpt!;
  const findNextAction = (count: number, current : string, resultList: IRobotAction[]): IRobotAction[] => {
    if(count === 0 ) {
      return resultList;
    }
    const action = preActionIdMap[current];

    if(action) {
      return findNextAction(count -1, action.id ?? action.actionId, resultList.concat(action!));
    }
    return resultList;
  };

  return findNextAction(actions.length - 1, head.id ?? head.actionId, [head]);
};

export const getTriggerList = (actions?: IRobotTrigger[]): IRobotTrigger[] => {
  return actions ?? [];
};
