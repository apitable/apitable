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

import { Avatar, Box, Button, Typography } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import Image from 'next/image';
import { getEnvVariables } from 'pc/utils/env';
import { useRobot, useRobotContext } from '../../hooks';
import { IStepProps } from '../interface';

export const RobotCreateGuideStep4 = (props: IStepProps) => {
  const { setCurrentRobotId } = useRobot();
  const { dispatch } = useRobotContext();
  const toggleNewRobotModal = () => {
    dispatch({ type: 'toggleNewRobotModal' });
  };
  const handleClick = () => {
    setCurrentRobotId(props.robotId);
    toggleNewRobotModal();
  };
  return (
    <Box
      width="336px"
      margin="24px 0px 118px 0px"
    >
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        height='110px'
        justifyContent='space-between'
        margin='0px 0px 24px 0px'
      >
        <Avatar
          icon={<Image src={integrateCdnHost(getEnvVariables().CREATE_ROBOT_AVATAR!)} width={64} height={64} />}
          size='l'
        />
        <Typography >
          {t(Strings.robot_create_wizard_step_4_desc)}
        </Typography>
      </Box>
      <Box
        height="120px"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Button
          block
          color="primary"
          onClick={handleClick}
        >
          {t(Strings.robot_create_wizard_step_4_button)}
        </Button>
      </Box>
    </Box>
  );
};
