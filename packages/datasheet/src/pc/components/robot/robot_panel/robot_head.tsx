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

import { useRobotContext } from '../hooks';
import { RobotDetailHead } from './robot_detail_head';
import { RobotRunHistoryHead } from './robot_history_head';
import { RobotListHead } from './robot_list_head';

export const RobotHead = () => {
  const { state } = useRobotContext();

  if (state.currentRobotId) {
    if (state.isHistory) {
      return <RobotRunHistoryHead />;
    }
    return <RobotDetailHead />;
  }
  return <RobotListHead />;
};
