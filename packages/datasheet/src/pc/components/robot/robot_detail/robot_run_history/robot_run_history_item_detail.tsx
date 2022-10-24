import { Box, useTheme, Typography } from '@vikadata/components';
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
  const taskDetailUrl = `/robots/run-history/${taskId}`;
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
  // 旧版本的数据不支持展示。
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