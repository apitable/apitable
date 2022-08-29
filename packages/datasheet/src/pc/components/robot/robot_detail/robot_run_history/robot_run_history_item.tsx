import { Box, Typography, useTheme, IconButton } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { ErrorFilled, RunFilled, SuccessFilled } from '@vikadata/icons';
import { timeFormatter } from 'pc/utils';
import { useState } from 'react';
import { IRobotRunHistoryItem } from '../../interface';
import { RobotRunHistoryItemDetail } from './robot_run_history_item_detail';
import { DropIcon, StyledArrowIcon } from './styled';
interface IRobotRunHistoryItemProps {
  item: IRobotRunHistoryItem;
}

enum RobotRunStatusEnums {
  RUNNING = 0,
  SUCCESS = 1,
  ERROR = 2,
}

export const RobotRunHistoryItem = ({ item }: IRobotRunHistoryItemProps) => {
  const theme = useTheme();
  const [showDetail, setShowDetail] = useState(false);

  const StatusTextMap = {
    [RobotRunStatusEnums.RUNNING]: t(Strings.robot_run_history_running),
    [RobotRunStatusEnums.SUCCESS]: t(Strings.robot_run_history_success),
    [RobotRunStatusEnums.ERROR]: t(Strings.robot_run_history_fail),
  };

  const StatusColorMap = {
    [RobotRunStatusEnums.RUNNING]: theme.color.fc0,
    [RobotRunStatusEnums.SUCCESS]: theme.color.fc15,
    [RobotRunStatusEnums.ERROR]: theme.color.fc10,
  };
  const StatusIconMap = {
    [RobotRunStatusEnums.RUNNING]: RunFilled,
    [RobotRunStatusEnums.SUCCESS]: SuccessFilled,
    [RobotRunStatusEnums.ERROR]: ErrorFilled,
  };

  const isRunning = item.status === RobotRunStatusEnums.RUNNING;
  const toggleDetail = () => {
    if (isRunning) {
      return;
    }
    setShowDetail(!showDetail);
  };
  const IconComponent = StatusIconMap[item.status];
  return (
    <Box
      marginTop="16px"
      borderRadius="8px"
      border={`1px solid ${theme.color.fc5}`}>
      <Box
        background={theme.color.fc8}
        borderRadius="8px"
        key={item.taskId}
        padding="16px"
        height='52px'
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={toggleDetail}
        style={{ cursor: 'pointer' }}
      >
        <Box display="flex" alignItems="center">
          <IconComponent color={StatusColorMap[item.status]} />
          <Typography variant="body3" color={StatusColorMap[item.status]} style={{ marginLeft: '4px' }} >
            {
              StatusTextMap[item.status]
            }
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography variant="body3">
            {
              timeFormatter(item.createdAt)
            }
          </Typography>
          <Box width="16px" />
          {
            !isRunning && <StyledArrowIcon rotated={showDetail}>
              <IconButton
                icon={DropIcon}
                onClick={toggleDetail} />
            </StyledArrowIcon>
          }
        </Box>
      </Box>
      {
        showDetail && <RobotRunHistoryItemDetail taskId={item.taskId} />
      }
    </Box>
  );
};