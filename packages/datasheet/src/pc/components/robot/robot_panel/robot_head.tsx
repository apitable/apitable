import { useRobotContext } from '../hooks';
import { RobotListHead } from './robot_list_head';
import { RobotDetailHead } from './robot_detail_head';
import { RobotRunHistoryHead } from './robot_history_head';

export const RobotHead = () => {
  const { state } = useRobotContext();

  if (state.currentRobotId) {
    if (state.isHistory) {
      return <RobotRunHistoryHead />;
    }
    return <RobotDetailHead />;
  }
  return <RobotListHead />;
};