import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React, { useEffect, useMemo } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {
  Box,
  IconButton,
  LinkButton,
  Loading,
  TextButton,
  Typography,
  useTheme,
  useThemeColors
} from '@apitable/components';
import { Strings, t, ThemeName } from '@apitable/core';
import { DownloadOutlined, LoadingOutlined, RefreshOutlined } from '@apitable/icons';
import { RobotRunHistoryItemDetail, useRunTaskDetail } from 'pc/components/robot/robot_detail/robot_run_history/robot_run_history_item_detail';
import { useAppSelector } from 'pc/store/react-redux';
import EmptyStateDarkImg from 'static/icon/datasheet/empty_state_dark.png';
import EmptyStateLightImg from 'static/icon/datasheet/empty_state_light.png';
import { getAutomationRunHistoryDetail } from '../../../robot/api';
import { useGetTaskHistory } from '../../../robot/robot_detail/robot_run_history';
import { useCssColors } from '../../../robot/robot_detail/trigger/use_css_colors';
import { automationHistoryAtom } from '../../controller/atoms';
import { CONST_DATETIME_FORMAT } from '../list';
import { TaskList } from '../list/task';
import { handleDownload } from '../list/util';

dayjs.extend(duration);

const CONST_STATUS_SUCCESS = 1;
const CONST_STATUS_FAIL = 2;
export const RunHistoryDetail = () => {
  const [currentHistoryState] = useAtom(automationHistoryAtom);

  const { reset, isLoadingData } = useGetTaskHistory();
  const { data, isLoading } = useRunTaskDetail(currentHistoryState?.taskId ?? '');

  const dataItem = data?.data;
  const colors = useThemeColors();

  const nodes = dataItem?.executedNodeIds?.filter((r) => !r.startsWith('atr'));

  const getTime = useMemo(() => {
    if (!dataItem) {
      return {
        start: undefined,
        end: undefined,
      };
    }
    if (dataItem?.executedNodeIds?.length === 0) {
      return {
        start: undefined,
        end: undefined,
      };
    }
    const start = dataItem.nodeByIds[nodes[0]].startAt;
    const end = dataItem.nodeByIds[nodes[nodes.length - 1]].endAt;

    return {
      start: dayjs.tz(start),
      end: dayjs.tz(end),
    };
  }, [dataItem, nodes]);

  const resultText = useMemo(() => {
    if (data?.status === CONST_STATUS_SUCCESS) {
      return t(Strings.automation_success);
    }
    if (data?.status === CONST_STATUS_FAIL) {
      return t(Strings.automation_run_fail);
    }
    return '';
  }, [data]);

  if (!currentHistoryState) return null;

  return (
    <Box flex={'0 0 54px'} display={'flex'}
      marginBottom={'16px'}
      alignItems={'flex-start'} flexDirection={'row'} justifyContent={'space-between'}>
      <Box display={'flex'} flexDirection={'column'} alignItems={'start'}>
        <Typography variant="h5" color={colors.textCommonPrimary}>
          {t(Strings.robot_run_history_title)}
        </Typography>

        <Box marginTop={'4px'}>
          <>
            {
              !isLoading && (
                <>
                  {
                    dataItem == null ? (
                      <Typography variant="body3" color={colors.textCommonTertiary} >
                        {
                          t(Strings.error)
                        }
                      </Typography>
                    ): (
                      <Typography variant="body3" color={colors.textCommonTertiary} >
                        {t(Strings.automation_run_history_item_description, {
                          RESULT: resultText,
                          NUM: Math.ceil(
                            dayjs.duration(
                              getTime.end?.diff(getTime.start, 'milliseconds') ?? 0
                            ).asSeconds()
                          ),

                          START_TIME: getTime.start?.format(CONST_DATETIME_FORMAT) ?? '',
                          END_TIME: getTime.end?.format(CONST_DATETIME_FORMAT) ?? '',
                        })}
                      </Typography>
                    )
                  }
                </>
              )
            }
          </>
        </Box>
      </Box>

      <Box display={'inline-flex'}>
        <TextButton
          prefixIcon={
            isLoadingData ? (
              <LoadingOutlined color={colors.textCommonTertiary} size={16} />
            ) : (
              <RefreshOutlined color={colors.textCommonTertiary} size={16} />
            )
          }
          onClick={() => {
            reset();
          }}
        >
          <Typography variant="body3" color={colors.textCommonPrimary}>
            {t(Strings.automation_refresh)}
          </Typography>
        </TextButton>

        <TextButton
          prefixIcon={<DownloadOutlined color={colors.textCommonTertiary} size={16} />}
          onClick={async () => {
            if (!currentHistoryState?.taskId) return;

            const result = await getAutomationRunHistoryDetail(currentHistoryState.taskId);
            handleDownload(result ?? {}, `automation_${currentHistoryState.taskId}.json`);
          }}
        >
          {
            <Typography variant="body3" color={colors.textCommonPrimary}>
              {t(Strings.download_log)}
            </Typography>
          }
        </TextButton>
      </Box>
    </Box>
  );
};

export const HistoryModalContent = () => {
  const { items, isLoadingInitialData, setSize, isEmpty, size, isReachingEnd, error, canLoadMore, isLoadingMore } = useGetTaskHistory();

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoadingInitialData,
    hasNextPage: !isReachingEnd,
    onLoadMore: () => canLoadMore && setSize(size + 1),
    disabled: !!error,
    rootMargin: '0px 0px 32px 0px',
  });

  const themeName = useAppSelector((state) => state.theme);
  const EmptyResultImage = themeName === ThemeName.Light ? EmptyStateLightImg : EmptyStateDarkImg;

  const [currentHistoryState, setCurrentHistoryState] = useAtom(automationHistoryAtom);
  const colors = useCssColors();
  const theme = useTheme();

  useEffect(() => {
    if (!items.length) {
      return;
    }
    if (!currentHistoryState.taskId) {
      setCurrentHistoryState((d) => {
        return {
          ...d,
          taskId: items[0].taskId,
        };
      });
    }
  }, [setCurrentHistoryState, currentHistoryState, items]);

  return (
    <Box height={'calc(80vh - 58px)'}
      display={'flex'} flexDirection={'row'} ref={rootRef}>
      <Box overflowY={'auto'} padding={'8px'} width={'256px'} flex={'0 0 256px'} backgroundColor={colors.bgCommonDefault} alignSelf={isEmpty ? 'center': undefined}>

        <TaskList list={items} isSummary activeId={currentHistoryState.taskId}/>

        {isEmpty && <Image src={EmptyResultImage} alt="" />}
        {isEmpty ? (
          <Box display="flex" justifyContent="center">
            <Typography variant="body2" color={colors.textCommonTertiary}>
              {t(Strings.robot_run_history_no_data)}
            </Typography>
          </Box>
        ) : (
          <Box ref={sentryRef} display="flex" alignItems="center" justifyContent="center" marginTop="16px">
            {isLoadingMore && (
              <Box display="flex">
                <Loading />
                <Typography component="span" variant="body4" color={theme.color.fc2}>
                  {t(Strings.loading)}
                </Typography>
              </Box>
            )}
            {isReachingEnd && (
              <Typography component="span" variant="body4" color={colors.textCommonTertiary}>
                {t(Strings.robot_run_history_bottom_tip)}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <Box display={'flex'} flex={'1'} flexDirection={'column'} backgroundColor={colors.bgCommonLower} overflowY={'hidden'} padding={'16px'}>
        {currentHistoryState.taskId && (
          <>
            <RunHistoryDetail />
            <RobotRunHistoryItemDetail taskId={currentHistoryState.taskId} />
          </>
        )}
      </Box>
    </Box>
  );
};
