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

import useSWR from 'swr';
import { Box, useTheme, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { nestReq } from '../../api';
import { useNodeTypeByIds } from '../../hooks';
import { IRobotHistoryTask } from '../../interface';
import { RobotRunHistoryActionDetail } from './robot_run_history_item_detail_action';
import { RobotRunHistoryNodeWrapper } from './robot_run_history_item_detail_node_wrapper';
import { RobotRunHistoryTriggerDetail } from './robot_run_history_item_detail_trigger';

interface IRobotRunHistoryItemDetailProps {
  taskId: string
}

export const useRunTaskDetail = (taskId: string) => {
  const taskDetailUrl = `/automation/run-history/${taskId}`;
  const { data, error } = useSWR(taskDetailUrl, nestReq);

  const taskDetail: IRobotHistoryTask = data?.data?.data;
  return {
    data: taskDetail,
    error
  };
};
export const RobotRunHistoryItemDetail = (props: IRobotRunHistoryItemDetailProps) => {
  const { taskId } = props;
  const { data, error } = useRunTaskDetail(taskId);
  const taskDetail = data?.data;
  const nodeTypeByIds = useNodeTypeByIds();
  const theme = useTheme();
  if (error || !taskDetail) {
    return null;
  }
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
    <Box flex={'1'} overflowY={'auto'}>
      <Box
        height='1px'
        background={theme.color.fc5}
        margin="0px 16px"
      />
      <Box padding="0px 16px 0px 0" >
        {
          nodeTypes.map((nodeType, index) => {
            const nodeDetail = taskDetail.nodeByIds[taskDetail.executedNodeIds[index]];
            const isTrigger = index === 0;
            return <RobotRunHistoryNodeWrapper
                isLast={index === nodeTypes.length - 1}
              status={data?.status}
              key={index} index={index} nodeType={nodeType} nodeDetail={nodeDetail}>
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
