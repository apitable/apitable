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
import { Box, IconButton, FloatUiTooltip as Tooltip, Typography } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import {
  WarnCircleFilled,
  ChevronRightOutlined,
  ChevronDownOutlined
} from '@apitable/icons';
import styles from 'style.module.less';
import { ItemStatus } from 'pc/components/automation/run_history/list/item_status';
import { INodeType, IRobotRunHistoryDetail } from '../../interface';
import { useCssColors } from '../trigger/use_css_colors';

interface IRobotRunHistoryNodeDetail {
  index: number;
  isLast: boolean;
  nodeType: INodeType;
  status: number;
  nodeDetail: IRobotRunHistoryDetail['nodeByIds'][string];
}

const VerticalLine = styled(Box)`
  border-left-style: solid;
  border-left-color: var(--borderCommonDefault);
  border-left-width: 1px;
  position: absolute;
  margin-right: 8px;
  left: 39px;
  top: 19px;
  height: 2000px;
`;

const VerticalLine2 = styled(Box)`
  border-left-style: solid;
  border-left-color: var(--borderCommonDefault);
  border-left-width: 1px;
  position: absolute;
  margin-right: 8px;
  left: 39px;
  top: -2000px;
  height: 2000px;
`;

export const RobotRunHistoryNodeWrapper = (props: React.PropsWithChildren<IRobotRunHistoryNodeDetail>) => {
  const { nodeType, index, isLast, status, children, nodeDetail } = props;
  const colors = useCssColors();
  const [showDetail, setShowDetail] = useState(false);
  const hasError = nodeDetail.errorStacks && nodeDetail.errorStacks.length > 0;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      minHeight={'42px'}
      width={'100%'}
      overflow="hidden"
      style={{ cursor: 'pointer' }}
    >
      <Box display="flex" position="relative" alignItems="flex-start" width={'100%'}>
        <Box display={'flex'} alignItems={'center'} onClick={() => setShowDetail(!showDetail)} height={'32px'}>
          <span className={cls(styles.arrowIcon)}>
            <IconButton shape={'square'}
              icon={showDetail ? ChevronDownOutlined: ChevronRightOutlined} className={styles.dropIcon} onClick={() => setShowDetail(!showDetail)} />
          </span>
          <Box marginX={'8px'} display="flex" alignItems="center" zIndex={2}>
            <ItemStatus status={status} variant={'filled'} />
          </Box>
        </Box>

        {
          index === 0 && (
            <VerticalLine2/>
          )
        }

        {!isLast && <VerticalLine />}

        <Box flexDirection={'column'} width={'100%'}>
          <Box flexDirection={'row'} alignItems={'center'} display={'flex'} onClick={() => setShowDetail(!showDetail)}>
            <Image src={integrateCdnHost(nodeType?.service?.logo)} alt={nodeType?.service?.name} width={32} height={32} />
            <Typography variant="h7" color={colors.textCommonPrimary} style={{ marginLeft: 8 }}>
              {nodeType.name}
            </Typography>
            {hasError && (
              <Box marginLeft="4px" display="flex" alignItems="center">
                <Tooltip content={t(Strings.robot_run_history_fail_tooltip)}>
                  <Box as="span" marginLeft="4px" display="flex" alignItems="center">
                    <WarnCircleFilled />
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Box>

          {showDetail && (
            <Box padding={'16px 16px'} borderRadius={'4px'} width={'100%'} marginBottom='16px' marginTop="16px" backgroundColor={colors.bgCommonDefault}>
              {children}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
