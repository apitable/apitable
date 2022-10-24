import { Avatar, Box, Switch, Typography, useTheme } from '@vikadata/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { ChevronRightOutlined } from '@vikadata/icons';

import Image from 'next/image';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import robotAvatar from 'static/icon/robot/robot_avatar.png';
import { useRobot, useToggleRobotActive } from '../hooks';
import { IRobotCardInfo } from '../interface';
import { NodeSpectator } from './node_spectator';
import styles from './styles.module.less';

interface IRobotListItemCardProps {
  robotCardInfo: IRobotCardInfo;
  onClick: () => void;
  readonly: boolean;
  index: number;
}

export const RobotListItemCard: React.FC<IRobotListItemCardProps> = ({ index, robotCardInfo, onClick, readonly }) => {
  const { name, nodeTypeList, robotId, isActive } = robotCardInfo;
  const theme = useTheme();
  const readonlyStyle: React.CSSProperties = readonly ? {
    cursor: 'not-allowed',
    pointerEvents: 'none',
    opacity: 0.5,
  } : { cursor: 'pointer' };

  const indexColorMap = {
    0: theme.color.deepPurple,
    1: theme.color.indigo,
    2: theme.color.blue,
    3: theme.color.teal,
    4: theme.color.green,
    5: theme.color.yellow,
    6: theme.color.orange,
    7: theme.color.pink,
    8: theme.color.brown,
    9: theme.color.purple,
  };
  const rightIndex = Math.min(index, 9);
  const borderColor = indexColorMap[rightIndex][isActive ? 500 : 100];
  const { robot } = useRobot(robotId);
  const { loading, toggleRobotActive } = useToggleRobotActive(robotId);
  return (
    <Box
      border={`1px solid ${theme.color.fc5}`}
      borderLeft={`4px solid ${borderColor}`}
      borderRadius="4px"
      marginTop="16px"
      background={theme.color.fc8}
      height="68px"
      style={readonlyStyle}
    >
      <Box
        padding="8px 0"
        margin="0 8px"
        onClick={onClick}
      >
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <Box display="flex" alignItems="center">
              <Avatar
                icon={<Image src={robotAvatar}/>}
                style={{ marginRight: 4, minWidth: '24px' }}
                size="xs"
              />
              <Typography variant="h8" ellipsis>
                {name || t(Strings.robot_unnamed)}
              </Typography>
            </Box>
          </Box>
          <ChevronRightOutlined />
        </Box>
        <Box display="flex" justifyContent="space-between" marginTop="8px" alignItems="center">
          <Box
            width="100%"
            display="flex"
            alignItems="center"
          >
            {nodeTypeList.map((nodeType, index) => {
              const isLast = index === nodeTypeList.length - 1;
              return <React.Fragment key={index}>
                <span className={styles.nodeLogo}>
                  <Image
                    key={`${nodeType.nodeTypeId}_${index}`}
                    src={integrateCdnHost(nodeType.service.logo)}
                    alt=""
                    width={24}
                    height={24}
                  />
                </span>

                {
                  // spectator
                  !isLast && <Box display="flex" margin="0 8px">
                    <NodeSpectator />
                  </Box>
                }
              </React.Fragment>;
            })}
          </Box>
          <Switch checked={robot!.isActive} size="small" disabled={readonly} loading={loading} onClick={(value, e) => {
            stopPropagation(e);
            toggleRobotActive();
          }} />
        </Box>
      </Box>
    </Box>
  );
};
