import { FC } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { EditableText } from '../../../editable_text';
import { updateRobotDescription, updateRobotName } from '../../api';
import { useRobot } from '../../hooks';

export const InputTitle: FC = () => {
  const {
    robot, updateRobot,
  } = useRobot();
  const colors = useThemeColors();

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
  };

  return (
    <EditableText onChange={handleNameChange}
      color={colors.textCommonPrimary}
      placeholder={t(Strings.robot_unnamed)}
      value={robot.name} />
  );
};

export const EditableInputDescription: FC = () => {
  const {
    robot, updateRobot,
  } = useRobot();
  const colors = useThemeColors();

  if (!robot) {
    return null;
  }
  const handleNameChange = async(value: string) => {
    const ok = await updateRobotDescription(robot.robotId, value);
    if (ok) {
      updateRobot({
        ...robot,
        description: value,
      });
    }
  };

  return (
    <EditableText onChange={handleNameChange}
      variant={'body4'}
      color={colors.textCommonPrimary}
      placeholder={t(Strings.click_here_to_write_description)}
      value={robot.description} />
  );
};
