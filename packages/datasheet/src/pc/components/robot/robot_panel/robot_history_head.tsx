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

import { Box, TextButton, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronLeftOutlined } from '@apitable/icons';
import { useRobot } from '../hooks';

export const RobotRunHistoryHead = () => {
  const { setIsHistory } = useRobot();
  return (
    <>
      <TextButton
        size="small"
        prefixIcon={<ChevronLeftOutlined />}
        onClick={() => {
          setIsHistory(false);
        }}
      >
        <span style={{ lineHeight: 1 }}>{t(Strings.robot_return)}</span>
      </TextButton>
      <Typography variant="h6">{t(Strings.robot_run_history_title)}</Typography>
      <Box display="flex" width="48px" justifyContent="space-between" />
    </>
  );
};
