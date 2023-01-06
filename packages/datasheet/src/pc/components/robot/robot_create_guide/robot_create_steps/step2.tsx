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

import { Avatar, Box, Button, Select, Tooltip, useTheme } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';

import Image from 'next/image';
import { getEnvVariables } from 'pc/utils/env';
import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import { createTrigger, getRobotBaseInfo } from '../../api';
import { getNodeTypeOptions } from '../../helper';
import { useDefaultTriggerFormData, useRobot, useTriggerTypes } from '../../hooks';
import { IStepProps } from '../interface';
// Create trigger
export const RobotCreateGuideStep2 = (props: IStepProps) => {
  const theme = useTheme();
  const { robotId, isActive } = props;
  const { data: triggerTypes, loading: triggerTypesLoading } = useTriggerTypes();
  const [loading, setLoading] = useState(false);
  const [triggerTypeId, setTriggerTypeId] = useState<string>('');
  const defaultFormData = useDefaultTriggerFormData();
  const { updateRobot } = useRobot(robotId);

  const createRobotTrigger = useCallback(async(triggerTypeId: string) => {
    const triggerType = triggerTypes.find((item) => item.triggerTypeId === triggerTypeId);
    // When the record is created, the default value needs to be filled in.
    const input = triggerType?.endpoint === 'record_created' ? defaultFormData : undefined;
    await createTrigger(robotId!, triggerTypeId, input);
    mutate(`/robots/${robotId}/trigger`);
    const robotBaseInfo = await getRobotBaseInfo(robotId!);
    updateRobot(robotBaseInfo);
  }, [robotId, defaultFormData, triggerTypes, updateRobot]);

  const handleClick = async() => {
    if (triggerTypeId) {
      setLoading(true);
      await createRobotTrigger(triggerTypeId);
      setLoading(false);
    }
    props.goNextStep();
  };

  if (!triggerTypes) {
    return null;
  }

  const handleTriggerTypeIdChange = (option) => {
    const triggerTypeId = option.value;
    if (triggerTypeId) {
      setTriggerTypeId(triggerTypeId);
    }
  };

  // triggerTypes to Select options
  const options = getNodeTypeOptions(triggerTypes);
  return (
    <Box
      width='336px'
      margin='24px 0px 118px 0px'
    >
      <Box
        display='flex'
        height='40px'
        margin='0px 0px 40px 0px'
      >
        <Tooltip
          content={t(Strings.robot_create_wizard_step_2_desc)}
          color={theme.color.textStaticPrimary}
          visible={props.isActive}
          style={{
            backgroundColor: theme.color.primaryColor,
            zIndex: 1000
          }}
          placement='right-center'
        >
          <span>
            <Avatar
              icon={<Image src={integrateCdnHost(getEnvVariables().CREATE_ROBOT_AVATAR!)} width={64} height={64} />}
              size='l'
            />
          </span>
        </Tooltip>
      </Box>
      <Box
        height='120px'
        width='100%'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
      >
        {
          !triggerTypesLoading && isActive && (
            <Select
              placeholder={t(Strings.robot_select_option)}
              options={options}
              value={triggerTypeId}
              onSelected={handleTriggerTypeIdChange}
              defaultVisible
            />
          )
        }
        <Button
          block
          loading={loading}
          disabled={loading || !triggerTypeId}
          color='primary'
          onClick={handleClick}
          style={{
            marginTop: 40
          }}
        >
          {t(Strings.robot_create_wizard_next)}
        </Button>
      </Box>
    </Box>
  );
};
