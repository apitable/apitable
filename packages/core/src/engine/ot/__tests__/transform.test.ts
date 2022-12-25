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

import { IJOTAction, jot, OTActionName } from '../';

describe('test jot transform', () => {
  it('test OR whit OI', () => {
    // const base = {
    //   array: [1, 2, 3, 4]
    // };
    const orAction = [{
      n: OTActionName.ObjectReplace,
      p: ['array'],
      oi: [3, 2, 4, 1],
      od: [1, 2, 3, 4]
    }] as IJOTAction[];

    const oiAction = [{
      n: OTActionName.ListInsert,
      p: ['array', 5],
      li: 1
    }] as IJOTAction[];

    const [leftOp, rightOp] = jot.transformX(orAction, oiAction);
    console.log(leftOp, rightOp);
  });
});
