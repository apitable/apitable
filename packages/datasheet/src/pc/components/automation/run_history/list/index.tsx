import dayjs from 'dayjs';
import * as React from 'react';
import { FC } from 'react';
import styled, { css } from 'styled-components';
import { Box, Dropdown, IconButton, IOverLayProps, stopPropagation, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { DownloadOutlined, MoreStandOutlined } from '@apitable/icons';
import { getAutomationRunHistoryDetail } from '../../../robot/api';
import { useActionTypes } from '../../../robot/hooks';
import { RobotRunStatusEnums } from '../../../robot/interface';
import { IRunHistoryDatum } from '../../../robot/robot_detail/robot_run_history';
import { ItemStatus } from './item_status';
import { handleDownload } from './util';
import styles from './styles.module.less';

export const CONST_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const StyledMenu = styled(Box)`
  &:hover {
    background: var(--bgBglessHover, rgba(255, 255, 255, 0.08));
  }

  cursor: pointer;
`;

const MoreButton = styled.span`
  visibility: hidden;
`;

const StyledTaskItem = styled(Box)<{ isActive: boolean }>`
  border-radius: 4px;
  cursor: pointer;

  ${(props) =>
    props.isActive &&
    css`
      background: var(--bgBrandLightDefault, rgba(255, 255, 255, 0.08));

      .${MoreButton} {
        visibility: visible !important;
      }

      ${MoreButton} {
        visibility: visible !important;
      }
    `}
  .${MoreButton} {
    visibility: hidden;
  }

  &:hover {
    background: var(--bgBglessHover, rgba(255, 255, 255, 0.08));

    .${MoreButton} {
      visibility: visible;
    }

    ${MoreButton} {
      visibility: visible;
    }
  }
`;

export const TaskItem: FC<{
  activeId?: string;
  item: IRunHistoryDatum;
  onClick?: () => void;
  isSummary?: boolean;
  hideMoreOperation?: boolean;
}> = ({ item, isSummary, activeId, onClick, hideMoreOperation }) => {
  const colors = useThemeColors();
  const isActive = item.taskId === activeId;
  const { data } = useActionTypes();
  const failed = item.executedActions.find((r) => !r.success);

  return (
    <StyledTaskItem display={'flex'} flexDirection={'row'} padding={'8px 0px 8px 8px'} isActive={isActive} onClick={onClick}>
      <Box display={'flex'} flexDirection={'row'} marginRight={'8px'} paddingTop={'4px'}>
        <ItemStatus status={item.status} variant={'outlined'} />
      </Box>

      <Box flex={'1'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="body2" color={colors.textCommonPrimary}>
            {dayjs.tz(item.createdAt).format(CONST_DATETIME_FORMAT)}
          </Typography>

          {!hideMoreOperation && (
            <Dropdown
              clazz={{
                overlay: styles.overlayStyle,
              }}
              options={{
                arrow: false,
                placement: 'bottom-end',
                stopPropagation: true,
              }}
              trigger={
                <MoreButton>
                  <IconButton shape="square" icon={MoreStandOutlined} />
                </MoreButton>
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
                      borderColor={' var(--radiusRadiusDefault, 4px);'}
                      backgroundColor={'var(--bgCommonHighest, #333)'}
                    >
                      <StyledMenu
                        padding={'8px'}
                        display={'inline-flex'}
                        alignItems={'center'}
                        onClick={async () => {
                          toggle();
                          const result = await getAutomationRunHistoryDetail(item.taskId);
                          handleDownload(result ?? {}, `automation_${item.robotId}_${item.taskId}.json`);
                        }}
                      >
                        <IconButton icon={() => <DownloadOutlined color={colors.textCommonTertiary} />} />

                        <Typography variant={'body4'} color={'var(--textCommonPrimary)'}>
                          {t(Strings.download)}
                        </Typography>
                      </StyledMenu>
                    </Box>
                  </>
                );
              }}
            </Dropdown>
          )}
        </Box>
        {!isSummary && (
          <Typography variant="body4" color={colors.textCommonTertiary}>
            {(item.status === RobotRunStatusEnums.SUCCESS || item.status === RobotRunStatusEnums.RUNNING) &&
              t(Strings.automation_run_history_item_brief_success, {
                NUM: item.executedActions.filter((r) => r.success).length,
              })}
            {item.status === RobotRunStatusEnums.ERROR &&
              t(Strings.automation_run_history_item_brief_fail, {
                ACTION_NAME: data.find((a) => a.actionTypeId === failed?.actionTypeId)?.name ?? '',
              })}
            {item.status === RobotRunStatusEnums.LIMIT && t(Strings.automation_run_times_over_limit)}
          </Typography>
        )}
      </Box>
    </StyledTaskItem>
  );
};
