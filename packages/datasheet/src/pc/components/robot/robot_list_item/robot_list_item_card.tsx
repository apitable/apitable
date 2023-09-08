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

import Image from 'next/image';
import * as React from 'react';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Box, Switch, Typography, useTheme } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';

import { ArrowRightOutlined, MoreOutlined } from '@apitable/icons';
import { stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { useRobot, useToggleRobotActive } from '../hooks';
import { IRobotCardInfo, IRobotNodeType, IRobotNodeTypeInfo } from '../interface';
import styles from './styles.module.less';

interface IRobotListItemCardProps {
  robotCardInfo: IRobotCardInfo;
  onClick: () => void;
  readonly: boolean;
  index: number;
}

const StyledBox = styled(Box)`
  &:hover {
    background-color: var(--bgControlsHover);
  }
`;

interface INodeStep {
  item?: IRobotNodeTypeInfo;
  type: 'node' | 'more';
}

export const RobotListItemCard: React.FC<React.PropsWithChildren<IRobotListItemCardProps>> = ({ index, robotCardInfo, onClick, readonly }) => {
  const { name, nodeTypeList, robotId, isActive } = robotCardInfo;

  const nodeSteps: INodeStep[] = useMemo(() => {
    const list: INodeStep[] = nodeTypeList.map((item) => ({
      type: 'node',
      item: item,
    }));
    if (list.length > 5) {
      const left = list.slice(0, 2);
      const right = list.slice(list.length - 2);
      const t: INodeStep = {
        type: 'more',
      };
      return left.concat(t).concat(...right);
    }
    return list;
  }, [nodeTypeList]);

  const theme = useTheme();
  const readonlyStyle: React.CSSProperties = readonly
    ? {
      cursor: 'not-allowed',
      pointerEvents: 'none',
      opacity: 0.5,
    }
    : { cursor: 'pointer' };

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
  const { robot } = useRobot(robotId);
  const { loading, toggleRobotActive } = useToggleRobotActive(robotId);

  return (
    <StyledBox border={`1px solid ${theme.color.fc5}`} borderRadius="4px" marginTop="16px" background={theme.color.fc8} style={readonlyStyle}>
      <Box padding="8px 0" margin="0 8px" onClick={onClick}>
        <Box display="flex" justifyContent="space-between" marginTop="8px" alignItems="center">
          <Box width="100%" display="flex" alignItems="center">
            {nodeSteps.map((item, index) => {
              const isLast = index === nodeSteps.length - 1;
              if (item.type === 'more') {
                return (
                  <>
                    <Box display="flex" marginRight="8px">
                      <MoreOutlined size={'12px'} />
                    </Box>

                    <Box display="flex" marginRight="8px">
                      <ArrowRightOutlined size={'12px'} />
                    </Box>
                  </>
                );
              }
              const nodeType = item.item as IRobotNodeTypeInfo;

              return (
                <React.Fragment key={index}>
                  <span className={styles.nodeLogo}>
                    <Image
                      key={`${nodeType.nodeTypeId}_${index}`}
                      src={integrateCdnHost(
                        nodeType.type === IRobotNodeType.Trigger && getEnvVariables().ROBOT_TRIGGER_ICON
                          ? getEnvVariables().ROBOT_TRIGGER_ICON!
                          : nodeType.service.logo,
                      )}
                      alt=""
                      width={24}
                      height={24}
                    />
                  </span>

                  {
                    // spectator
                    !isLast && (
                      <Box display="flex" margin="0 8px">
                        <ArrowRightOutlined size={'12px'} />
                      </Box>
                    )
                  }
                </React.Fragment>
              );
            })}
          </Box>
          <Switch
            checked={robot!.isActive}
            size="default"
            disabled={readonly}
            loading={loading}
            onClick={(_value, e) => {
              stopPropagation(e);
              toggleRobotActive();
            }}
          />
        </Box>
      </Box>

      <Box display="flex" alignItems="center" margin={'0 8px'}>
        <Box display="flex" alignItems="center" marginBottom={'16px'}>
          <Typography variant="h8" ellipsis>
            {name || t(Strings.robot_unnamed)}
          </Typography>
        </Box>
      </Box>
    </StyledBox>
  );
};
