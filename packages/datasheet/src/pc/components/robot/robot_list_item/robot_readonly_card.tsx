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

import { useAtom } from 'jotai/index';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import {
  applyDefaultTheme,
  Box,
  Divider,
  Dropdown,
  IconButton,
  IOverLayProps,
  stopPropagation,
  Tooltip,
  Typography,
  useTheme,
  useThemeColors,
} from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';

import { ArrowRightOutlined, MoreOutlined, MoreStandOutlined } from '@apitable/icons';
import { automationHistoryAtom, automationStateAtom } from 'pc/components/automation/controller';
import AutomationHistoryPanel from 'pc/components/automation/run_history/modal/modal';
import { IAutomationRobotDetailItem } from 'pc/components/robot/robot_context';
import { useActionTypes, useTriggerTypes } from 'pc/components/robot/robot_panel/hook_trigger';
import { getEnvVariables } from 'pc/utils/env';
import EllipsisText from '../../ellipsis_text';
import { AutomationScenario, IAutomationDatum, IRobotNodeType, IRobotNodeTypeInfo } from '../interface';
import { getActionList, getTriggerList } from '../robot_detail/utils';
import styles from './styles.module.less';

interface IRobotListItemCardProps {
  robotCardInfo: IAutomationDatum;
  onNavigate: (nodeId: string) => void;
  handleDelete: () => void;
  readonly: boolean;
  index?: number;
}

const StyledDivider = styled(Divider)``;

const StyledMenu = styled(Box).attrs(applyDefaultTheme)`
  &:hover {
    background: var(--bgBglessHover, rgba(255, 255, 255, 0.08));
  }
  ${(props) => css`
    &:active {
      background: ${props.theme.color.fill1};
    }
  `}

  cursor: pointer;
  margin: 0 8px;
  border-radius: 4px;
`;

const StyledBox = styled(Box)``;

interface INodeStep {
  item?: IRobotNodeTypeInfo;
  type: 'node' | 'more';
}

export const RobotListItemCardReadOnly: React.FC<React.PropsWithChildren<IRobotListItemCardProps>> = ({
  handleDelete,
  robotCardInfo,
  onNavigate,
  readonly,
}) => {
  const { name, isOverLimit } = robotCardInfo;
  const { data: triggerTypes } = useTriggerTypes();
  const router = useRouter();
  const { originData: actionTypes } = useActionTypes();

  const [historyDialog, setHistoryDialog] = useAtom(automationHistoryAtom);
  const [automationState, setAutomationStateAtom] = useAtom(automationStateAtom);

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
    : { cursor: 'default' };

  const colors = useThemeColors();

  return (
    <StyledBox border={`1px solid ${theme.color.borderCommonDefault}`} borderRadius="4px" style={readonlyStyle}>
      <Box padding="8px 0" margin="0 8px" display={'flex'} alignItems={'center'}>
        {/*marginTop="8px"*/}
        <Box display="flex" justifyContent="space-between" alignItems="center" flex={'1 1 auto'}>
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
        </Box>

        <Dropdown
          options={{
            arrow: false,
            placement: 'bottom-end',
            stopPropagation: true,
          }}
          trigger={
            <span>
              <IconButton shape="square" icon={MoreStandOutlined} />
            </span>
          }
        >
          {({ toggle }: IOverLayProps) => {
            return (
              <>
                <Box
                  onClick={stopPropagation}
                  width={'132px'}
                  display={'flex'}
                  flexDirection={'column'}
                  borderColor={colors.borderCommonDefault}
                  borderRadius={'4px'}
                  backgroundColor={colors.bgCommonHighest}
                  borderWidth={'1px'}
                  padding={'4px 0'}
                  boxShadow={'0px 12px 24px 0px rgba(0, 0, 0, 0.16), 0px 3px 6px 0px rgba(0, 0, 0, 0.12)'}
                >
                  <StyledMenu
                    padding={'8px'}
                    display={'inline-flex'}
                    alignItems={'center'}
                    onClick={() => {
                      router.push(`/workbench/${robotCardInfo?.resourceId}`);
                    }}
                  >
                    <Typography variant={'body4'} color={'var(--textCommonPrimary)'}>
                      {t(Strings.config)}
                    </Typography>
                  </StyledMenu>

                  <StyledMenu
                    padding={'8px'}
                    display={'inline-flex'}
                    alignItems={'center'}
                    onClick={() => {
                      toggle();
                      setHistoryDialog({
                        dialogVisible: true,
                      });
                      setAutomationStateAtom({
                        currentRobotId: robotCardInfo.robotId,
                        resourceId: robotCardInfo.resourceId,
                        scenario: AutomationScenario.node,
                        // @ts-ignore
                        robot: robotCardInfo,
                      });
                    }}
                  >
                    <Typography variant={'body4'} color={'var(--textCommonPrimary)'}>
                      {t(Strings.check_run_history)}
                    </Typography>
                  </StyledMenu>

                  <Box padding={'0 8px'}>
                    <StyledDivider />
                  </Box>

                  <StyledMenu padding={'8px'} display={'inline-flex'} alignItems={'center'} onClick={handleDelete}>
                    <Typography variant={'body4'} color={'var(--textCommonPrimary)'}>
                      {t(Strings.remove)}
                    </Typography>
                  </StyledMenu>
                </Box>
              </>
            );
          }}
        </Dropdown>
      </Box>

      <Box display="flex" alignItems="center" margin={'0 8px'}>
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

      {historyDialog.dialogVisible && (
        <AutomationHistoryPanel
          onClose={() => {
            setHistoryDialog((draft) => ({
              ...draft,
              dialogVisible: false,
            }));
          }}
        />
      )}
    </StyledBox>
  );
};
