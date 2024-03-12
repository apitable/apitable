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

import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ExecuteType } from 'command_manager/types';
import { ResourceType } from 'types';
import { UndoManager } from '../undo_manager';

describe('add undo stack', () => {
  let undoManager: UndoManager;

  beforeEach(() => {
    undoManager = new UndoManager('dst1');
  });

  describe('add execution cmd', () => {
    it('should add to undo stack', () => {
      undoManager.addUndoStack({
        cmd: CollaCommandName.DeleteRecords,
        result: {
          resourceId: 'dst1',
          resourceType: ResourceType.Datasheet,
          result: ExecuteResult.Success,
          actions: [],
        }
      }, ExecuteType.Execute);

      expect(undoManager.getStockLength('undo')).toBe(1);
    });
  });

  describe('add redo cmd', () => {
  });

  it('should delete old elements if undo stack size exceeds limit', () => {
  });
});
