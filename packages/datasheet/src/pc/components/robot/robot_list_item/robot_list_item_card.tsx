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
import { Box, Switch, Tooltip, Typography, useTheme, useThemeColors } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';

import { ArrowRightOutlined, MoreOutlined } from '@apitable/icons';
import { useAutomationList } from 'pc/components/automation/controller/use_robot_list';
import { stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import EllipsisText from '../../ellipsis_text';
import { useActionTypes, useAutomationRobot, useToggleRobotActive, useTriggerTypes } from '../hooks';
import { IAutomationDatum, IRobotNodeType, IRobotNodeTypeInfo } from '../interface';
import { getActionList, getTriggerList } from '../robot_detail/utils';
import styles from './styles.module.less';

interface IRobotListItemCardProps {
  robotCardInfo: IAutomationDatum;
  onNavigate: () => void;
  readonly: boolean;
  index: number;
}

const StyledBox = styled(Box)`
  &:hover {
    background-color: var(--bgBglessHover);
  }

  &:active {
    background-color: var(--bgBglessActive);
  }
`;

interface INodeStep {
  item?: IRobotNodeTypeInfo;
  type: 'node' | 'more';
}

export const RobotListItemCard: React.FC<React.PropsWithChildren<IRobotListItemCardProps>> = ({ index, robotCardInfo, onNavigate, readonly }) => {
  const { name, robotId, isOverLimit } = robotCardInfo;
  const { data: triggerTypes } = useTriggerTypes();
  const { originData: actionTypes } = useActionTypes();

  // @ts-ignore
  const list = getActionList(
    (robotCardInfo.actions ?? []).map((action) => ({
      ...action,
      id: action.actionId,
    })),
  ).map((action) => {
    const triggerType = actionTypes.find((trigger) => trigger.actionTypeId === action.actionTypeId);
    return {
      // @ts-ignore
      nodeTypeId: action.actionId,
      service: triggerType?.service!,
      type: IRobotNodeType.Action,
    };
  });

  const nodeTypeList: IRobotNodeTypeInfo[] = [
    ...getTriggerList(robotCardInfo.triggers)
      .slice(0, 1)
      .map((trigger) => {
        const triggerType = triggerTypes.find((item) => trigger.triggerTypeId === item.triggerTypeId);
        return {
          nodeTypeId: trigger.triggerId,
          service: triggerType?.service!,
          type: IRobotNodeType.Trigger,
        };
      }),
    ...list,
  ];

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

  const { resourceId, currentRobotId, robot } = useAutomationRobot();
  const { loading, toggleRobotActive } = useToggleRobotActive(resourceId!, robotId);
  const {
    api: { refresh },
  } = useAutomationList();

  const colors = useThemeColors();

  return (
    <StyledBox border={`1px solid ${theme.color.borderCommonDefault}`} borderRadius="4px" marginTop="16px" style={readonlyStyle}>
      <Box padding="8px 0" margin="0 8px" onClick={onNavigate}>
        <Box display="flex" justifyContent="space-between" marginTop="8px" alignItems="center">
          <Box width="100%" display="flex" alignItems="center">
            {nodeSteps.map((item, index) => {
              const isLast = index === nodeSteps.length - 1;
              if (item.type === 'more') {
                return (
                  <>
                    <Box display="flex" marginRight="8px">
                      <MoreOutlined size={'12px'} color={colors.textCommonTertiary} />
                    </Box>

                    <Box display="flex" marginRight="8px">
                      <ArrowRightOutlined size={'12px'} color={colors.textCommonTertiary} />
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
                          : nodeType.service?.logo ?? '',
                      )}
                      alt=""
                      width={24}
                      height={24}
                    />
                  </span>

                  {!isLast && (
                    <Box display="flex" margin="0 8px">
                      <ArrowRightOutlined size={'12px'} color={colors.textCommonTertiary} />
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
          </Box>
          <Switch
            checked={robotCardInfo!.isActive}
            size="default"
            disabled={readonly}
            loading={loading}
            onClick={async (_value, e) => {
              stopPropagation(e);
              await toggleRobotActive(robotCardInfo!.isActive);
              await refresh();
            }}
          />
        </Box>
      </Box>

      <Box display="flex" alignItems="center" margin={'0 8px'} onClick={onNavigate}>
        <Box display="flex" justifyContent={'space-between'} alignItems="center" marginBottom={'16px'} width={'100%'}>
          <EllipsisText>
            <Typography variant="h8" ellipsis style={{ maxWidth: '78%' }}>
              {name || t(Strings.robot_unnamed)}
            </Typography>
          </EllipsisText>
          {isOverLimit && (
            <Tooltip content={t(Strings.automation_run_failure_tip)}>
              <div className={'vk-border-[1px] vk-rounded-sm vk-border-solid vk-px-1'} style={{ borderColor: colors.borderDangerDefault }}>
                <Typography variant={'body4'} color={colors.textDangerDefault}>
                  {t(Strings.automation_run_failure)}
                </Typography>
              </div>
            </Tooltip>
          )}
        </Box>
      </Box>
    </StyledBox>
  );
};
