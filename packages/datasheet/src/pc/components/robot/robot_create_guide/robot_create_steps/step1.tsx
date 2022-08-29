import Image from 'next/image';
import { Avatar, Box, Button, TextInput, Typography } from '@vikadata/components';
import { Selectors } from '@vikadata/core';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRobot } from '../../hooks';
import { IStepProps } from '../interface';
import robotGuideAvatar from 'static/icon/robot/robot_guide_avatar.png';
import { t, Strings } from '@vikadata/core';

export const RobotCreateGuideStep1 = (props: IStepProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { robotId, setRobotId } = props;
  const datasheetId = useSelector(Selectors.getActiveDatasheetId);
  const { createRobot } = useRobot();
  // const updateRobotName = useUpdateRobotName();
  const handleClick = async() => {
    setLoading(true);
    if (!robotId) {
      // 创建机器人
      const newRobotId = await createRobot({
        resourceId: datasheetId!,
        name,
      });
      setRobotId(newRobotId);
      // if (newRobotId) {
      //   updateRobotName(newRobotId, name);
      // }
    } else {
      // await updateRobotName(robotId, name);
    }
    setLoading(false);
    // 更新机器人名称
    props.goNextStep();
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
          icon={<Image src={robotGuideAvatar} />}
          size="l"
        />
        <Typography >
          {t(Strings.robot_create_wizard_step_1_desc)}
        </Typography>
      </Box>
      <Box
        height="120px"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <TextInput
          placeholder={t(Strings.robot_create_name_placeholder)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          block
        />
        <Button
          block
          disabled={loading || name.trim().length === 0}
          loading={loading}
          color="primary"
          onClick={handleClick}
        >
          {t(Strings.robot_create_wizard_next)}
        </Button>
      </Box>
    </Box>
  );
};
