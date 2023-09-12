import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { FC } from 'react';
import * as React from 'react';
import styled, { css } from 'styled-components';
import {
  Box,
  Dropdown,
  IconButton,
  IOverLayProps,
  stopPropagation,
  Typography,
  useThemeColors,
} from '@apitable/components';
import { Strings, t } from '@apitable/core';
import {
  CheckCircleOutlined, CheckFilled,
  DownloadOutlined,
  MoreStandOutlined,
  PlayFilled,
  PlayOutlined,
  WarnCircleOutlined, WarnFilled
} from '@apitable/icons';
import { getAutomationRunHistoryDetail } from '../../../robot/api';
import { IRobotRunHistoryItem } from '../../../robot/interface';
import { automationHistoryAtom } from '../../controller';
import styles from './styles.module.less';
import { handleDownload } from './util';

export const CONST_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const ItemStatus = ({ status }: { status: number }) => {
  const colors = useThemeColors();
  return (
    <>
      {status === 3 && <PlayOutlined color={colors.textBrandDefault} size={16} />}
      {status === 1 && <CheckCircleOutlined color={colors.textSuccessDefault} size={16} />}
      {status === 2 && <WarnCircleOutlined color={colors.textWarnDefault} size={16} />}
    </>
  );
};

export const RunItemStatus = ({ status }: { status: number }) => {
  const colors = useThemeColors();
  return (
    <>
      {status === 3 && <PlayFilled color={colors.textBrandDefault} size={16} />}
      {status === 1 && <CheckFilled color={colors.textSuccessDefault} size={16} />}
      {status === 2 && <WarnFilled color={colors.textWarnDefault} size={16} />}
    </>
  );
};

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

export const TaskItem: FC<{ activeId?: string, item: IRobotRunHistoryItem; onClick?: () => void; isSummary?: boolean }> = ({ item, activeId, onClick }) => {
  const colors = useThemeColors();
  const isSummary = true;
  const isActive = item.taskId === activeId;

  return (
    <StyledTaskItem display={'flex'} flexDirection={'row'} padding={'8px'} isActive={isActive} onClick={onClick}>
      <Box display={'flex'} flexDirection={'row'} marginRight={'8px'} paddingTop={'4px'}>
        <ItemStatus status={item.status} />
      </Box>

      <Box flex={'1'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="body2" color={colors.textCommonPrimary}>
            {dayjs(item.createdAt).format(CONST_DATETIME_FORMAT)}
          </Typography>

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
                      onClick={async() => {
                        toggle();
                        const result = await getAutomationRunHistoryDetail(item.taskId);
                        handleDownload(result ?? {}, `robot_${item.robotId}_${item.taskId}.json`);
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
        </Box>

        {!isSummary && (
          //TODO  wait for backend api
          <Typography variant="body4" color={colors.textCommonTertiary}>
            {item.status === 1 &&
              t(Strings.automation_run_history_item_brief_success, {
                NUM: 1,
              })}
            {item.status === 2 &&
              t(Strings.automation_run_history_item_brief_fail, {
                ACTION_NAME: '发送网络请求',
              })}

            {item.status === 3 &&
              t(Strings.automation_run_history_item_brief_success, {
                NUM: '1',
              })}
          </Typography>
        )}
      </Box>
    </StyledTaskItem>
  );
};
