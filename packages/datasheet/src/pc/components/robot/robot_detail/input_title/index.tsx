import { useAtomValue } from 'jotai';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useThemeColors } from '@apitable/components';
import { IReduxState, Strings, t } from '@apitable/core';
import { updateNodeInfo } from '@apitable/core/dist/modules/space/store/actions/catalog_tree';
import { useAppSelector } from 'pc/store/react-redux';
import { automationNameAtom, automationStateAtom } from '../../../automation/controller';
import {
  useAutomationResourceNode,
  useAutomationResourcePermission
} from '../../../automation/controller/use_automation_permission';
import { EditableText } from '../../../editable_text';
import { updateRobotName } from '../../api';
import { useAutomationRobot } from '../../hooks';
import { AutomationScenario } from '../../interface';

export const WidthEditableText = styled(EditableText)`
  max-width: 400px;
`;

export const InputTitle: FC = () => {
  const { robot, updateRobot } = useAutomationRobot();
  const colors = useThemeColors();
  const [value, setValue] = useState(robot?.name);

  const automationState = useAtomValue(automationStateAtom);
  const automationName = useAtomValue(automationNameAtom);

  const nodeItem = useAutomationResourceNode();

  const { templateId } = useAppSelector((state: IReduxState) => state.pageParams);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!templateId) {
      if (automationState?.scenario === AutomationScenario.node) {
        setValue(nodeItem?.nodeName);
      }
    }else {
      setValue(automationName);
    }
  }, [automationName, automationState?.scenario, dispatch, nodeItem?.nodeId, nodeItem?.nodeName, nodeItem?.type, templateId]);

  const { manageable } = useAutomationResourcePermission();
  if (!robot) {
    return null;
  }
  const handleNameChange = async (name: string) => {
    if (name !== robot.name) {
      if (!automationState?.resourceId) {
        console.error('automationState?.resourceId is null');
        return;
      }
      const updateResp = await updateRobotName(automationState?.resourceId, robot.robotId, name);
      if (updateResp) {
        setValue(name);
        updateRobot({
          ...robot,
          name,
        });

        if (automationState?.scenario === AutomationScenario.node) {
          dispatch(updateNodeInfo(nodeItem.nodeId, nodeItem.type, { name: name }));
        }
      }
    }
  };

  return (
    <WidthEditableText
      editable={manageable}
      onChange={handleNameChange} color={colors.textCommonPrimary} placeholder={t(Strings.robot_unnamed)}
      value={value}/>
  );
};
