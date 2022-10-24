
import { useTheme } from '@vikadata/components';
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
 * 在检测到机器人没有 trigger 时，渲染创建 trigger 的表单
 */
export const RobotTriggerCreateForm = ({ robotId, triggerTypes }: IRobotTriggerCreateProps) => {
  const defaultFormData = useDefaultTriggerFormData();
  const theme = useTheme();

  const createRobotTrigger = useMemo(() => {
    return async(triggerTypeId: string) => {
      const triggerType = triggerTypes.find((item) => item.triggerTypeId === triggerTypeId);
      // 当 trigger 为记录创建时，需要填入默认值。
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