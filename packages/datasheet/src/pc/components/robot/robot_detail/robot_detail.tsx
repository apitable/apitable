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

import { memo, useEffect } from 'react';
import { Box, Typography } from '@apitable/components';
import {
  ResourceType,
  Strings,
  t,
} from '@apitable/core';
import {CONST_MAX_ACTION_COUNT, CONST_MAX_TRIGGER_COUNT} from 'pc/components/automation/config';
import { useActionTypes, useAutomationRobot, useTriggerTypes } from '../hooks';
import { RobotActions } from './action/robot_actions';
import { EditType, RobotTrigger } from './trigger/robot_trigger';
import { useCssColors } from './trigger/use_css_colors';

export const RobotDetailForm = memo(() => {
  const { loading, data: actionTypes } = useActionTypes();
  const { loading: triggerTypeLoading, data: triggerTypes } = useTriggerTypes();
  const { robot } = useAutomationRobot();

  // useEffect(() => {
  //   setTimeout(() => {
  //     resourceService.instance?.initialized &&
  //     resourceService.instance?.switchResource({
  //       to: resourceId as string,
  //       resourceType: ResourceType.Datasheet,
  //     });
  //   }, 1000);
  // }, []);

  const colors = useCssColors();
  if (loading || !actionTypes || triggerTypeLoading || !triggerTypes || !robot) {
    return null;
  }

  return (
    <>
      <Box paddingTop={'40px'} paddingBottom={'16px'}>
        <Typography variant="h5" color={colors.textCommonPrimary}>
          {t(Strings.when)} ( {robot?.triggers?.length ?? 0} / {CONST_MAX_TRIGGER_COUNT} )
        </Typography>
      </Box>

      <RobotTrigger editType={EditType.entry} robotId={robot.robotId} triggerTypes={triggerTypes} />

      <Box paddingTop={'40px'} paddingBottom={'16px'}>
        <Typography variant="h5" color={colors.textCommonPrimary}>
          {t(Strings.then)} ( {robot?.actions?.length ?? 0} / {CONST_MAX_ACTION_COUNT} )
        </Typography>
      </Box>
      <RobotActions robotId={robot.robotId} triggerTypes={triggerTypes} />
    </>
  );
});
