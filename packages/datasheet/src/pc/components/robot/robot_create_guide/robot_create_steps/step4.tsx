import { Avatar, Box, Button, Typography } from '@apitable/components';
import Image from 'next/image';
import { useRobot, useRobotContext } from '../../hooks';
import { IStepProps } from '../interface';
import robotGuideAvatar from 'static/icon/robot/robot_guide_avatar.png';
import { t, Strings } from '@apitable/core';

export const RobotCreateGuideStep4 = (props: IStepProps) => {
  const { setCurrentRobotId } = useRobot();
  const { dispatch } = useRobotContext();
  const toggleNewRobotModal = () => {
    dispatch({ type: 'toggleNewRobotModal' });
  };
  const handleClick = () => {
    setCurrentRobotId(props.robotId);
    toggleNewRobotModal();
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
        <Avatar icon={<Image src={robotGuideAvatar} />} />
        <Typography >
          {t(Strings.robot_create_wizard_step_4_desc)}
        </Typography>
      </Box>
      <Box
        height="120px"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Button
          block
          color="primary"
          onClick={handleClick}
        >
          {t(Strings.robot_create_wizard_step_4_button)}
        </Button>
      </Box>
    </Box>
  );
};
