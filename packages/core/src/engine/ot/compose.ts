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

import { IOperation, jot, OTActionName } from 'engine/ot';
import { isEqual } from 'lodash';

/**
 * Compose (Merge) operations
 * Only compose for operations that same path and single action's operation 
 * 
 * @param operations Operations Array
 */
export function composeOperations(operations: IOperation[]): IOperation[] {
  return operations.reduce<IOperation[]>((pre, cur) => {
    delete cur.resourceType;
    delete cur.revision;
    delete cur.fieldTypeMap;
    if (pre.length) {
      const preOp = pre.pop();
      const { operation, isComposed } = composeOperation(cur, preOp!);
      if (operation != null) {
        pre.push(operation);
        if (!isComposed) {
          pre.push(cur);
        }
      }
    } else {
      pre.push(cur);
    }
    return pre;
  }, []);
}

export function composeOperation(preOperation: IOperation, curOperation: IOperation): { operation: IOperation | null; isComposed: boolean } {
  if (
    curOperation.actions.length === preOperation.actions.length &&
    curOperation.actions.length === 1 &&
    preOperation.actions[0]!.p.length === curOperation.actions[0]!.p.length
  ) {
    // filter the same actions as od, oi or li, ld
    const actions = jot.compose(curOperation.actions, preOperation.actions).filter((action: any) => {
      if (action.n === OTActionName.ObjectReplace) {
        return !isEqual(action.od, action.oi);
      }
      if (action.n === OTActionName.ListReplace) {
        return !isEqual(action.ld, action.li);
      }
      return true;
    });
    // The merged actions do not exceed the length of the original actions
    if (actions.length <= curOperation.actions.length) {
      let operation: IOperation | null = null;
      if (actions.length > 0) {
        operation = { ...curOperation, actions };
      }
      return { operation, isComposed: true };
    }
  }
  return { operation: curOperation, isComposed: false };
}
