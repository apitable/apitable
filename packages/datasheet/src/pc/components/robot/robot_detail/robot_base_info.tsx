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

import { Avatar, Box, Switch, TextInput, Typography, useTheme } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import Image from 'next/image';
import { getEnvVariables } from 'pc/utils/env';
import * as React from 'react';
import { updateRobotDescription, updateRobotName } from '../api';
import { useDefaultRobotDesc, useRobot, useToggleRobotActive } from '../hooks';

export const RobotBaseInfo = () => {
  const {
    currentRobotId, robot, updateRobot,
    setIsEditingRobotName, isEditingRobotName,
    setIsEditingRobotDesc, isEditingRobotDesc
  } = useRobot();
  const defaultRobotDesc = useDefaultRobotDesc(currentRobotId!);
  const { loading, toggleRobotActive } = useToggleRobotActive(currentRobotId!);
  const theme = useTheme();

  if (!robot) {
    return null;
  }

  const handleNameChange = async(name: string) => {
    if (name !== robot.name) {
      const ok = await updateRobotName(robot.robotId, name);
      if (ok) {
        updateRobot({
          ...robot,
          name
        });
      }
    }
    setIsEditingRobotName(false);
  };

  const handleDescChange = async(desc: string) => {
    if (desc !== robot.description) {
      const ok = await updateRobotDescription(robot.robotId, desc);
      if (ok) {
        updateRobot({
          ...robot,
          description: desc
        });
      }
    }
    setIsEditingRobotDesc(false);
  };

  const robotDesc = robot.description || defaultRobotDesc;
  return (
    <Box marginBottom="24px">
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <Avatar
            icon={<Image src={integrateCdnHost(getEnvVariables().ROBOT_DEFAULT_AVATAR!)} width={24} height={24} />}
            size="xs"
            style={{
              minWidth: '24px',
            }}
          />
          <Box marginLeft="4px">
            {
              isEditingRobotName ? <TextInput
                size="small"
                autoFocus
                block
                defaultValue={robot.name}
                onBlur={(e) => handleNameChange(e.target.value)} /> :
                <div onDoubleClick={() => setIsEditingRobotName(true)}>
                  <Typography variant="h6">
                    {robot.name || t(Strings.robot_unnamed)}
                  </Typography>
                </div>
            }
          </Box>

        </Box>
        <Switch checked={robot.isActive} onClick={toggleRobotActive} loading={loading} disabled={loading} />
      </Box>
      <Box marginTop="4px" display="flex" alignItems="center">
        {
          isEditingRobotDesc ? <TextInput
            size="small"
            autoFocus
            defaultValue={robotDesc}
            block
            onBlur={(e) => handleDescChange(e.target.value)} /> :
            <div onDoubleClick={() => setIsEditingRobotDesc(true)}>
              <Typography variant="body3" ellipsis={{ rows: 2, tooltip: robotDesc }} color={theme.color.fc3}>
                {robotDesc}
              </Typography>
            </div>
        }
      </Box>
    </Box>
  );
};
