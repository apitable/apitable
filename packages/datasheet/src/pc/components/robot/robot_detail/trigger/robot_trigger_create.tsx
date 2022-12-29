
import { useTheme } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { useMemo } from 'react';
import { ITriggerType } from '../../interface';
import { mutate } from 'swr';
import { createTrigger } from '../../api';
import { useDefaultTriggerFormData } from '../../hooks';
import { Select } from '../select';

interface IRobotTriggerCreateProps {
  robotId: string;
  triggerTypes: ITriggerType[];
}

/**
 * Renders the form for creating a trigger when the robot is detected to have no trigger
 */
export const RobotTriggerCreateForm = ({ robotId, triggerTypes }: IRobotTriggerCreateProps) => {
  const defaultFormData = useDefaultTriggerFormData();
  const theme = useTheme();

  const createRobotTrigger = useMemo(() => {
    return async(triggerTypeId: string) => {
      const triggerType = triggerTypes.find((item) => item.triggerTypeId === triggerTypeId);
      // When the trigger is created for a record, the default value needs to be filled in.
      const input = triggerType?.endpoint === 'record_created' ? defaultFormData : undefined;
      const triggerRes = await createTrigger(robotId, triggerTypeId, input);
      mutate(`/robots/${robotId}/trigger`);
      return triggerRes.data;
    };
  }, [robotId, defaultFormData, triggerTypes]);

  if (!triggerTypes) {
    return null;
  }

  // const triggerCreateForm = {
  //   type: 'object',
  //   properties: {
  //     triggerTypeId: {
  //       type: 'string',
  //       title: t(Strings.robot_no_step_config_1),
  //       enum: triggerTypes.map(t => t.triggerTypeId),
  //       enumNames: triggerTypes.map(t => t.name),
  //     },
  //   }
  // };
  const handleCreateFormChange = (triggerTypeId) => {
    if (triggerTypeId) {
      createRobotTrigger(triggerTypeId);
    }
  };

  const options = triggerTypes.map((v) => ({
    label: v.name,
    value: v.triggerTypeId,
  }));

  return (
    <div>
      <div style={{ color: theme.color.fc3, fontSize: 12, paddingBottom: 8 }} >
        {t(Strings.robot_no_step_config_1)}
      </div>
      <Select
        options={options}
        onChange={handleCreateFormChange}
        placeholder={t(Strings.robot_select_option)}
      />
      {/* <Form schema={triggerCreateForm as any} children={<div />} onChange={handleCreateFormChange} /> */}
    </div>
  );
};