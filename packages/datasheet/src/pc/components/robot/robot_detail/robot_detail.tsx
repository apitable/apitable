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

import axios from 'axios';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Box, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useActionTypes, useRobot, useTriggerTypes } from '../hooks';
import { IRobotTrigger } from '../interface';
import { useRobotListState } from '../robot_list';
import { CONST_MAX_ACTION_COUNT } from './action/robot_action_create';
import { getActionList, RobotActions } from './action/robot_actions';
import { EditType, RobotTrigger } from './trigger/robot_trigger';
import {useCssColors} from "./trigger/use_css_colors";

const req = axios.create({
  baseURL: '/nest/v1/',
});

export const RobotDetailForm = () => {
  const [trigger, setTrigger] = useState<IRobotTrigger>();
  const { loading, data: actionTypes } = useActionTypes();
  const { loading: triggerTypeLoading, data: triggerTypes } = useTriggerTypes();
  const { robot } = useRobot();

  const {
    state: { formList },
  } = useRobotListState();

  const { data, error } = useSWR(`/automation/robots/${robot?.robotId}/actions`, req);
  const actions = data?.data?.data;
  const actionList = useMemo(() => getActionList(actions), [actions]);

  const colors = useCssColors();
  if (loading || !actionTypes || triggerTypeLoading || !triggerTypes || !robot || error) {
    return null;
  }

  return (
    <>
      <Box paddingTop={'40px'} paddingBottom={'16px'}>
        <Typography variant="h5" color={colors.textCommonPrimary}>{t(Strings.when)}</Typography>
      </Box>

      <RobotTrigger editType={EditType.entry} robotId={robot.robotId} triggerTypes={triggerTypes} formList={formList} setTrigger={setTrigger} />

      <Box paddingTop={'40px'} paddingBottom={'16px'}>
        <Typography variant="h5" color={colors.textCommonPrimary}>
          {t(Strings.then)} ( {actionList?.length ?? 0} / {CONST_MAX_ACTION_COUNT} )
        </Typography>
      </Box>

      <RobotActions robotId={robot.robotId} trigger={trigger} triggerTypes={triggerTypes} />
    </>
  );
};
