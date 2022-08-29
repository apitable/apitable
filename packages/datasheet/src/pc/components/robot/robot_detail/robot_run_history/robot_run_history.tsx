import { Box, Loading, Skeleton, Typography, useTheme } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';
import { getRobotRunHistoryList } from '../../api';
import { useRobot } from '../../hooks';
import { RobotRunHistoryItem } from './robot_run_history_item';

const PAGE_SIZE = 20;

export const RobotRunHistory = () => {
  const { currentRobotId } = useRobot();
  const { data, error, size, setSize } = useSWRInfinite(
    index => `/robots/run-history?size=${PAGE_SIZE}&page=${index + 1}&robotId=${currentRobotId}`,
    getRobotRunHistoryList
  );
  const items = data ? data.flat() : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  // const isRefreshing = isValidating && data && data.length === size;
  const canLoadMore = !isReachingEnd && !isLoadingMore;

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoadingInitialData,
    hasNextPage: !isReachingEnd,
    onLoadMore: () => canLoadMore && setSize(size + 1),
    disabled: !!error,
    rootMargin: '0px 0px 32px 0px',
  });
  const theme = useTheme();
  return <>
    <Box padding="16px">
      <Box display="flex" alignItems="center">
        <Box
          height="12px"
          width="2px"
          backgroundColor={theme.color.fc0}
          marginRight="4px"
        />
        <Typography variant="body3" color={theme.color.fc3}>
          <div dangerouslySetInnerHTML={{ __html: t(Strings.robot_run_history_desc) }} />
        </Typography>
      </Box>
      {
        (error || !data) && <Skeleton
          count={3}
          height="52px"
          type="text"
          circle={false}
          style={{
            marginBottom: 16,
          }}
        />
      }
      <Box
        height="calc(100vh - 150px)"
        overflow="scroll"
        ref={rootRef}
      >
        {
          items.map(item => <RobotRunHistoryItem key={item.taskId} item={item} />)
        }
        {
          isEmpty ? <Box
            display="flex"
            justifyContent="center"
            marginTop="210px"
          >
            <Typography variant="body2" color={theme.color.fc2}>{t(Strings.robot_run_history_no_data)}</Typography>
          </Box> : <Box
            ref={sentryRef}
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop="16px"
          >
            {(isLoadingMore) &&
                <Box display="flex">
                  <Loading />
                  <Typography
                    component="span"
                    variant="body4"
                    color={theme.color.fc2}
                  >
                    正在加载更多…
                  </Typography>
                </Box>
            }
            {
              isReachingEnd &&
                <Typography
                  component="span"
                  variant="body4"
                  color={theme.color.fc2}
                >
                  {t(Strings.robot_run_history_bottom_tip)}
                </Typography>
            }
          </Box>
        }
      </Box>
    </Box >
  </>;
};
