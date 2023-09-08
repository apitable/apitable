import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { FC } from 'react';
import * as React from 'react';
import styled, { css } from 'styled-components';
import {
  Box,
  ContextMenu, Dropdown,
  IconButton, IOverLayProps,
  stopPropagation,
  Typography,
  useContextMenu,
  useThemeColors
} from '@apitable/components';
import { Strings, t } from '@apitable/core';
import {
  CheckCircleOutlined, DownloadOutlined,
  MoreStandOutlined,
  PlayOutlined,
  WarnCircleOutlined
} from '@apitable/icons';
import { flatContextData } from '../../../../utils';
import { IRobotRunHistoryItem } from '../../../robot/interface';
import { automationHistoryAtom } from '../../controller';
import styles from './styles.module.less';
import { handleDownload } from './util';

export const CONST_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const ItemStatus = ({ status }: { status: number }) => {
  const colors = useThemeColors();
  return (
    <>

      {
        status === 3 && (
          <PlayOutlined color={colors.textBrandDefault} size={16} />
        )
      }
      {
        status === 1 && (
          <CheckCircleOutlined color={colors.textSuccessDefault} size={16} />
        )
      }
      {
        status === 2 && (
          <WarnCircleOutlined color={colors.textWarnDefault} size={16} />
        )
      }

    </>
  );
};

const StyledMenu = styled(Box)`
  &:hover {
    background: var(--bgBglessHover, rgba(255, 255, 255, 0.08));
  }
  cursor: pointer;
  `;
const StyledTaskItem = styled(Box)<{isActive: boolean}>`
  border-radius: 4px;
  cursor: pointer;
  
  ${props => props.isActive && css`
    background: var(--bgBglessHover, rgba(255, 255, 255, 0.08));
  `}

  &:hover {
    background: var(--bgBglessHover, rgba(255, 255, 255, 0.08));
  }
`;

export const TaskItem: FC<{item: IRobotRunHistoryItem,
    onClick?: () => void,
    isSummary?:boolean
}> = ({ item, onClick }) => {
  const colors = useThemeColors();
  const isSummary = true;
  const [historyAtom] = useAtom(automationHistoryAtom);
  const isActive = item.taskId ===historyAtom.taskId;

  return (
    <StyledTaskItem display={'flex'} flexDirection={'row'} padding={'8px'} isActive={isActive}
      onClick={onClick}
    >
      <Box display={'flex'} flexDirection={'row'} marginRight={'8px'} paddingTop={'4px'} >
        <ItemStatus status={item.status} />
      </Box>

      <Box flex={'1'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>

          <Typography variant="body2" color={colors.textCommonPrimary}>
            {
              dayjs(item.createdAt).format(CONST_DATETIME_FORMAT)
            }
          </Typography>

          <Dropdown
            clazz={{
              overlay: styles.overlayStyle
            }}
            options={
              {
                placement: 'bottom-end',
              }
            } trigger={
              <span>

                <IconButton
                  shape="square"
                  icon={MoreStandOutlined}
                />
              </span>
            }>
            {
              ({ toggle }: IOverLayProps) => {
                return (<>
                  <Box
                    onClick={stopPropagation}
                    width={'132px'}
                    display={'flex'}
                    flexDirection={'column'}
                    borderColor={' var(--radiusRadiusDefault, 4px);'}
                    backgroundColor={'var(--bgCommonHighest, #333)'}>
                    <StyledMenu padding={'8px'} display={'inline-flex'}
                      alignItems={'center'}
                      onClick={(e)=> {
                        toggle();
                        handleDownload(item, `robot_${item.robotId}_${item.taskId}.json`);
                        stopPropagation(e);
                      }}
                    >
                      <IconButton
                        icon={
                          () => <DownloadOutlined />
                        }
                      />

                      <Typography variant={'body4'} color={'var(--textCommonPrimary)'}>
                        {t(Strings.download)}
                      </Typography>

                    </StyledMenu>
                  </Box>
                </>);
              }
            }
          </Dropdown>
        </Box>

        {
          !isSummary && (
            <Typography variant="body4" color={colors.textCommonTertiary}>
              {item.status === 1 &&
                    t(Strings.automation_run_history_item_brief_success, {
                      NUM: 1
                    })
              }
              {item.status === 2 && t(Strings.automation_run_history_item_brief_fail, {
                // TODO  add action name
                ACTION_NAME: '发送网络请求'
              })
              }

              {item.status === 3 && t(Strings.automation_run_history_item_brief_success, {
                NUM: '1'
              })
              }
            </Typography>
          )
        }

      </Box>
    </StyledTaskItem>
  );
};
