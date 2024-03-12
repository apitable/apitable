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

import * as React from 'react';
import { Box, FloatUiTooltip, IconButton, Typography, useTheme } from '@apitable/components';
import { Selectors, Strings, t } from '@apitable/core';
import { AddOutlined, CloseOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { useAppSelector } from 'pc/store/react-redux';
import { useAutomationNavigateController } from '../../automation/controller/controller';
import { OrTooltip } from '../../common/or_tooltip';
import { useAddNewRobot } from '../hooks';

export const Beta = () => {
  const theme = useTheme();
  return (
    <Box display="flex" background={theme.color.primaryLight} borderRadius="2px" padding="1px 4px" marginLeft="8px">
      <Typography variant="h9" color={theme.color.primaryColor}>
        BETA
      </Typography>
    </Box>
  );
};

export const AddRobotButton = () => {
  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId);
  const { canAddNewRobot, disableTip } = useAddNewRobot();

  const { createNewRobot } = useAutomationNavigateController();

  return (
    <OrTooltip tooltip={disableTip} tooltipEnable={!canAddNewRobot}>
      <IconButton
        shape={'square'}
        disabled={!canAddNewRobot}
        onClick={canAddNewRobot ? () => createNewRobot(datasheetId) : undefined}
        icon={AddOutlined}
      />
    </OrTooltip>
  );
};

export const RobotListHead = () => {
  return (
    <>
      <AddRobotButton />

      <Box display="flex" alignItems="center">
        <Typography variant="h6">{t(Strings.robot_panel_title)}</Typography>
        <FloatUiTooltip content={t(Strings.robot_panel_help_tooltip)} placement="left" arrow>
          <Box display="flex" alignItems="center">
            <IconButton
              shape="square"
              icon={QuestionCircleOutlined}
              onClick={() => {
                window.open(t(Strings.robot_help_url));
              }}
            />
          </Box>
        </FloatUiTooltip>
      </Box>
      <IconButton shape="square" onClick={() => ShortcutActionManager.trigger(ShortcutActionName.ToggleRobotPanel)} icon={CloseOutlined} />
    </>
  );
};
