import { Box, TextButton, Typography } from '@vikadata/components';
import { Strings, t } from '@apitable/core';
import { ChevronLeftOutlined } from '@vikadata/icons';
import { useRobot } from '../hooks';

export const RobotRunHistoryHead = () => {
  const { setIsHistory } = useRobot();
  return <>
    <TextButton
      size="small"
      prefixIcon={<ChevronLeftOutlined />}
      style={{ position: 'absolute', left: 8, paddingLeft: 8, paddingRight: 8 }}
      onClick={() => {
        setIsHistory(false);
      }}
    >
      <span style={{ lineHeight: 1 }}>{t(Strings.robot_return)}</span>
    </TextButton>
    <Typography variant="h6">
      {t(Strings.robot_run_history_title)}
    </Typography>
    {/* 占位 */}
    <Box
      display="flex"
      width="48px"
      justifyContent="space-between"
      position="absolute"
      right="16px"
    />
  </>;
};