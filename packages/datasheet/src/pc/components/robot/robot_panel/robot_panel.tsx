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

import { useMount } from 'ahooks';
import { useSetAtom } from 'jotai';
import { Provider } from 'jotai/react';
import React, { memo } from 'react';
import { SWRConfig } from 'swr';
import { Box, ThemeProvider, useTheme } from '@apitable/components';
import { Selectors } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { automationStateAtom } from '../../automation/controller';
import { AutomationScenario } from '../interface';
import { FormEditProvider } from '../robot_detail/form_edit';
import { RobotList } from '../robot_list';
import { AutomationDrawer } from './automation_modal';
import { RobotListHead } from './robot_list_head';

const RobotBase = () => {
  const cachedTheme = useAppSelector(Selectors.getTheme);

  const theme = useTheme();

  const setAutomationAtom = useSetAtom(automationStateAtom );

  useMount(()=> {
    setAutomationAtom({
      scenario: AutomationScenario.datasheet,
    });
  });

  return (
    <FormEditProvider>
      <Provider>

        <ThemeProvider theme={cachedTheme}>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
            }}
          >
            <AutomationDrawer />
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
              <RobotListHead />
            </Box>
            <Box overflow="auto" padding="0 8px" backgroundColor={theme.color.fc8} height="calc(100vh - 49px)">
              <RobotList />
            </Box>
          </SWRConfig>
        </ThemeProvider>
      </Provider>
    </FormEditProvider>
  );
};

const RobotPanel = memo(RobotBase);

export default RobotPanel;
