/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Avatar, Box, Switch, Typography, useTheme } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { ChevronRightOutlined } from '@apitable/icons';

import Image from 'next/image';
import { stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import * as React from 'react';
import { useRobot, useToggleRobotActive } from '../hooks';
import { IRobotCardInfo, IRobotNodeType } from '../interface';
import { NodeSpectator } from './node_spectator';
import styles from './styles.module.less';

interface IRobotListItemCardProps {
  robotCardInfo: IRobotCardInfo;
  onClick: () => void;
  readonly: boolean;
  index: number;
}

export const RobotListItemCard: React.FC<React.PropsWithChildren<IRobotListItemCardProps>> = ({ index, robotCardInfo, onClick, readonly }) => {
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
      borderRadius='4px'
      marginTop='16px'
      background={theme.color.fc8}
      height='68px'
      style={readonlyStyle}
    >
      <Box
        padding='8px 0'
        margin='0 8px'
        onClick={onClick}
      >
        <Box display='flex' alignItems='center'>
          <Box width='100%'>
            <Box display='flex' alignItems='center'>
              <Avatar
                icon={<Image alt={''} src={integrateCdnHost(getEnvVariables().ROBOT_DEFAULT_AVATAR!)} width={24} height={24} />}
                style={{ marginRight: 4, minWidth: '24px' }}
                size='xs'
              />
              <Typography variant='h8' ellipsis>
                {name || t(Strings.robot_unnamed)}
              </Typography>
            </Box>
          </Box>
          <ChevronRightOutlined />
        </Box>
        <Box display='flex' justifyContent='space-between' marginTop='8px' alignItems='center'>
          <Box
            width='100%'
            display='flex'
            alignItems='center'
          >
            {nodeTypeList.map((nodeType, index) => {
              const isLast = index === nodeTypeList.length - 1;
              return <React.Fragment key={index}>
                <span className={styles.nodeLogo}>
                  <Image
                    key={`${nodeType.nodeTypeId}_${index}`}
                    src={integrateCdnHost((nodeType.type === IRobotNodeType.Trigger && getEnvVariables().ROBOT_TRIGGER_ICON) ? getEnvVariables().ROBOT_TRIGGER_ICON! : nodeType.service.logo)}
                    alt=''
                    width={24}
                    height={24}
                  />
                </span>

                {
                  // spectator
                  !isLast && <Box display='flex' margin='0 8px'>
                    <NodeSpectator />
                  </Box>
                }
              </React.Fragment>;
            })}
          </Box>
          <Switch checked={robot!.isActive} size='small' disabled={readonly} loading={loading} onClick={(_value, e) => {
            stopPropagation(e);
            toggleRobotActive();
          }} />
        </Box>
      </Box>
    </Box>
  );
};
