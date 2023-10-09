import { useAtom } from 'jotai';
import * as React from 'react';
import { memo } from 'react';
import { Box } from '@apitable/components';
import { IRobotActionProps, RobotAction } from 'pc/components/robot/robot_detail/action/robot_action';
import { useAutomationRobot, useTriggerTypes } from '../../../robot/hooks';
import { EditType, RobotTrigger } from '../../../robot/robot_detail/trigger/robot_trigger';
import { automationPanelAtom, PanelName } from '../../controller';
import { BaseInfo } from '../basic_info';

export const Side = memo(() => {
  const { robot } = useAutomationRobot();

  const [panel] = useAtom(automationPanelAtom);

  const { data: triggerTypes } = useTriggerTypes();

  if (!robot?.robotId) {
    return null;
  }

  switch (panel.panelName) {
    case PanelName.Action: {
      const props = panel.data as unknown as IRobotActionProps;

      return (
        <Box paddingX={'24px'} height={'100%'} paddingBottom={'16px'} paddingTop={'16px'}>
          <RobotAction {...props} editType={EditType.detail} />
        </Box>
      );
    }

    case PanelName.Trigger: {
      return (
        <Box paddingX={'24px'} height={'100%'} paddingBottom={'16px'} paddingTop={'16px'}>
          <RobotTrigger editType={EditType.detail} robotId={robot.robotId} triggerTypes={triggerTypes} />
        </Box>
      );
    }

    default: {
      return <BaseInfo />;
    }
  }
});
