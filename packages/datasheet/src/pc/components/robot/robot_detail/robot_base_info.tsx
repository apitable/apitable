import { t, Strings } from '@apitable/core';
import { Avatar, Box, Switch, TextInput, Typography, useTheme } from '@apitable/components';
import Image from 'next/image';
import * as React from 'react';
import { updateRobotDescription, updateRobotName } from '../api';
import { useDefaultRobotDesc, useRobot, useToggleRobotActive } from '../hooks';
import robotAvatar from 'static/icon/robot/robot_avatar.png';

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
            icon={<Image src={robotAvatar}/>}
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
