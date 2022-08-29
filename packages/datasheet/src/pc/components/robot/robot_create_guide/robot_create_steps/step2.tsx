import { Avatar, Box, Button, Select, Tooltip, useTheme } from '@vikadata/components';
import { useState, useCallback } from 'react';
import { mutate } from 'swr';
import { createTrigger, getRobotBaseInfo } from '../../api';
import { getNodeTypeOptions } from '../../helper';
import { useDefaultTriggerFormData, useRobot, useTriggerTypes } from '../../hooks';
import { IStepProps } from '../interface';
import robotGuideAvatar from 'static/icon/robot/robot_guide_avatar.png';
import { t, Strings } from '@vikadata/core';

import Image from 'next/image';
// 创建 trigger
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
    // 当记录创建时候，需要填入默认值。
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
            <Avatar icon={<Image src={robotGuideAvatar} />} />
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
