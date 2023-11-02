import { isEqualWith } from 'lodash';
import { customizer } from 'pc/components/robot/robot_detail/trigger/robot_trigger';
import { IRobotAction, IRobotTrigger } from '../../robot/interface';

export const checkIfModified = (remote: {
    triggers: IRobotTrigger[],
    actions: IRobotAction[]
}, local: Map<string, IRobotTrigger | IRobotAction>) => {

  const triggerResult = remote.triggers.some(trigger => {
    if (!local.get(trigger.triggerId)) {
      return false;
    }
    return !isEqualWith(trigger.input, local.get(trigger.triggerId), customizer);
  });

  if(triggerResult) {
    return true;
  }
  return remote.actions.some(action => {
    if (!local.get(action.actionId)) {
      return false;
    }
    return !isEqualWith(action.input, local.get(action.actionId), customizer);
  });

};
