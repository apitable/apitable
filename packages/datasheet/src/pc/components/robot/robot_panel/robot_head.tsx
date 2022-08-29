import { useRobotContext } from '../hooks';
import { RobotListHead } from './robot_list_head';
import { RobotDetailHead } from './robot_detail_head';
import { RobotRunHistoryHead } from './robot_history_head';

export const RobotHead = () => {
  const { state } = useRobotContext();

  // 默认列表 => 指定机器人详情 => 指定机器人详情的运行历史
  if (state.currentRobotId) {
    if (state.isHistory) {
      return <RobotRunHistoryHead />;
    }
    return <RobotDetailHead />;
  }
  return <RobotListHead />;
};