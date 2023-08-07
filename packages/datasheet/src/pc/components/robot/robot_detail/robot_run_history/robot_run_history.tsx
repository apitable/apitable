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

import { Box, Loading, Skeleton, Typography, useTheme } from '@apitable/components';
import { Strings, t, ThemeName } from '@apitable/core';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';
import { getRobotRunHistoryList } from '../../api';
import { useRobot } from '../../hooks';
import { RobotRunHistoryItem } from './robot_run_history_item';
import EmptyStateLightImg from 'static/icon/datasheet/empty_state_light.png';
import EmptyStateDarkImg from 'static/icon/datasheet/empty_state_dark.png';
import Image from 'next/image';
import styles from './style.module.less';
import { useSelector } from 'react-redux';

const PAGE_SIZE = 20;

export const RobotRunHistory = () => {
  const { currentRobotId } = useRobot();
  const { data, error, size, setSize } = useSWRInfinite(
    index => `/robots/run-history?size=${PAGE_SIZE}&page=${index + 1}&robotId=${currentRobotId}`,
    getRobotRunHistoryList
  );
  const themeName = useSelector(state => state.theme);
  const EmptyResultImage = themeName === ThemeName.Light ? EmptyStateLightImg : EmptyStateDarkImg;
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
      <Box display="flex" alignItems="start">
        <Box
          height="12px"
          width="2px"
          backgroundColor={theme.color.fc0}
          marginRight="4px"
          marginTop="4px"
        />
        <Typography variant="body3" color={theme.color.fc3} className={styles.historyTitle}>
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
        ref={rootRef}
      >
        {
          items.map(item => <RobotRunHistoryItem key={item.taskId} item={item} />)
        }
        {isEmpty && (
          <Image src={EmptyResultImage} alt="" />
        )}
        {
          isEmpty ? <Box
            display="flex"
            justifyContent="center"
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
