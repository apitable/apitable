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

import { Box, useTheme, Typography } from '@apitable/components';
import useSWR from 'swr';
import { nestReq } from '../../api';
import { useNodeTypeByIds } from '../../hooks';
import { IRobotRunHistoryDetail } from '../../interface';
import { RobotRunHistoryNodeWrapper } from './robot_run_history_item_detail_node_wrapper';
import { RobotRunHistoryTriggerDetail } from './robot_run_history_item_detail_trigger';
import { RobotRunHistoryActionDetail } from './robot_run_history_item_detail_action';
import { Strings, t } from '@apitable/core';

interface IRobotRunHistoryItemDetailProps {
  taskId: string
}

export const RobotRunHistoryItemDetail = (props: IRobotRunHistoryItemDetailProps) => {
  const { taskId } = props;
  const taskDetailUrl = `/automation/run-history/${taskId}`;
  const nodeTypeByIds = useNodeTypeByIds();
  const { data, error } = useSWR(taskDetailUrl, nestReq);
  const theme = useTheme();
  if (error || !data) {
    return null;
  }
  const taskDetail: IRobotRunHistoryDetail = data?.data.data.data;
  if (!taskDetail) {
    return <Box padding="16px">
      <Typography variant="body3">{t(Strings.robot_run_history_fail_unknown_error)} (taskId: {taskId})</Typography>
    </Box>;
  }
  // Older versions of data are not supported for display.
  if (!taskDetail.nodeByIds) {
    return <Box padding="16px">
      <Typography variant="body3">{t(Strings.robot_run_history_old_version_tip)}</Typography>
    </Box>;
  }
  const nodeTypes = taskDetail.executedNodeIds.map(nodeId => nodeTypeByIds[taskDetail.nodeByIds[nodeId].typeId]);
  return (
    <Box>
      <Box
        height='1px'
        background={theme.color.fc5}
        margin="0px 16px"
      />
      <Box padding="16px">
        {
          nodeTypes.map((nodeType, index) => {
            const nodeDetail = taskDetail.nodeByIds[taskDetail.executedNodeIds[index]];
            const isTrigger = index === 0;
            return <RobotRunHistoryNodeWrapper key={index} index={index} nodeType={nodeType} nodeDetail={nodeDetail}>
              {
                isTrigger ? <RobotRunHistoryTriggerDetail nodeType={nodeType} nodeDetail={nodeDetail} /> :
                  <RobotRunHistoryActionDetail nodeType={nodeType} nodeDetail={nodeDetail} />
              }
            </RobotRunHistoryNodeWrapper>;
          })
        }
      </Box>
    </Box>
  );
};