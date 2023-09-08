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

import { memo } from 'react';
import { useSelector } from 'react-redux';
import { SWRConfig } from 'swr';
import { Box, useTheme, ThemeProvider } from '@apitable/components';
import { Selectors } from '@apitable/core';
import { RobotContextProvider } from '../robot_context';
import { RobotCreateGuideModal } from '../robot_create_guide';
import { RobotList } from '../robot_list';
import { RobotHead } from './robot_head';

const RobotBase = () => {
  const cacheTheme = useSelector(Selectors.getTheme);

  const theme = useTheme();

  return (
    <RobotContextProvider>
      <ThemeProvider theme={cacheTheme}>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
          }}
        >
          <RobotCreateGuideModal />
          <Box
            height="50px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="16px 8px"
            borderBottom={`1px solid ${theme.color.lineColor}`}
            position="relative"
            backgroundColor={theme.color.bgCommonDefault}
          >
            <RobotHead />
          </Box>
          <Box overflow="auto" padding="16px 8px" backgroundColor={theme.color.fc8} height="calc(100vh - 49px)">
            <RobotList />
          </Box>
        </SWRConfig>
      </ThemeProvider>
    </RobotContextProvider>
  );
};

const RobotPanel = memo(RobotBase);

export default RobotPanel;
