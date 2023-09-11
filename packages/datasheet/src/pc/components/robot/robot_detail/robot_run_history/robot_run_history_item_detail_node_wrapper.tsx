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

import cls from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Box, IconButton, Tooltip, Typography, useTheme, useThemeColors } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { WarnCircleFilled, ChevronRightOutlined, CheckCircleFilled } from '@apitable/icons';
import { ItemStatus } from '../../../automation/run_history/list';
import { INodeType, IRobotRunHistoryDetail } from '../../interface';
import styles from 'style.module.less';

interface IRobotRunHistoryNodeDetail {
  index: number;
  isLast: boolean;
  nodeType: INodeType;
  status: number;
  nodeDetail: IRobotRunHistoryDetail['nodeByIds'][string];
}

const VerticalLine = styled(Box)`
  border-left: 1px solid var(--borderCommonDefault);
  border-style: solid;
  position: absolute;
  margin-right: 8px;
  left: 39px;
  top: 19px;
  height: 2000px;
`;

export const RobotRunHistoryNodeWrapper = (props: React.PropsWithChildren<IRobotRunHistoryNodeDetail>) => {
  const { nodeType, index, isLast, status, children, nodeDetail } = props;
  const isTrigger = index === 0;
  const colors = useThemeColors();
  const theme = useTheme();
  const [showDetail, setShowDetail] = useState(false);
  const hasError = nodeDetail.errorStacks && nodeDetail.errorStacks.length > 0;
  return (<Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    minHeight={'42px'}
    overflow="hidden"
    style={{ cursor: 'pointer' }}
    onClick={() => setShowDetail(!showDetail)}
  >
    <Box
      display="flex"
      position="relative"
      alignItems="flex-start"
    >
      <Box display={'flex'}
        height={'24px'}
      >
        <span className={cls(styles.arrowIcon, { [styles.rotated]: showDetail })}>
          <IconButton
            icon={ChevronRightOutlined}
            className={styles.dropIcon}
            onClick={() => setShowDetail(!showDetail)} />
        </span>
        <Box marginX={'8px'}
          display="flex"
          alignItems="center">
          <ItemStatus status={status} />
        </Box>
      </Box>

      {
        !isLast && (
              <VerticalLine />
          )
      }

      <Box flexDirection={'column'} >
        <Box flexDirection={'row'} alignItems={'center'} display={'flex'}>
          <Image src={integrateCdnHost(nodeType.service.logo)} alt={nodeType.service.name} width={24} height={24} />
          <Typography variant="h7" color={theme.color.fc1} style={{ marginLeft: 8 }}>
            {nodeType.name}
          </Typography>
          {
            hasError && <Box
              marginLeft="4px"
              display="flex"
              alignItems="center"
            >
              <Tooltip content={t(Strings.robot_run_history_fail_tooltip)}>
                <Box
                  as="span"
                  marginLeft="4px"
                  display="flex"
                  alignItems="center"
                >
                  <WarnCircleFilled />
                </Box>
              </Tooltip>
            </Box>
          }
        </Box>

        {
          showDetail && <Box padding={'16px 16px'}
            marginLeft={'48px'}
            marginTop="16px" backgroundColor={colors.bgCommonDefault}>
            {children}
          </Box>
        }
      </Box>
    </Box>
  </Box>);
};
