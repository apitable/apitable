import { useAtomValue } from 'jotai';
import * as React from 'react';
import { FC } from 'react';
import { Strings, t } from '@apitable/core';
import { automationStateAtom } from '../../../automation/controller';
import { useAutomationResourcePermission } from '../../../automation/controller/use_automation_permission';
import { updateRobotDescription } from '../../api';
import { useAutomationRobot } from '../../hooks';
import { WidthEditableText } from '../input_title';
import { useCssColors } from '../trigger/use_css_colors';

export const EditableInputDescription: FC = () => {
  const { robot, updateRobot } = useAutomationRobot();
  const colors = useCssColors();

  const automationState = useAtomValue(automationStateAtom);

  const { editable } = useAutomationResourcePermission();

  if (!robot) {
    return null;
  }
  const handleNameChange = async (value: string) => {
    if(!automationState?.resourceId) {
      console.error('automationState?.resourceId is null');
      return;
    }
    const ok = await updateRobotDescription(automationState?.resourceId, robot.robotId, value);
    if (ok) {
      updateRobot({
        ...robot,
        description: value,
      });
    }
  };

  return (
    <WidthEditableText
      editable={editable}
      onChange={handleNameChange}
      variant={'body4'}
      color={colors.textCommonTertiary}
      placeholder={t(Strings.click_here_to_write_description)}
      value={robot.description}
    />
  );
};
