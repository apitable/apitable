import { isEqualWith } from 'lodash';
import { customizer } from 'pc/components/robot/robot_detail/trigger/robot_trigger';
import { IRobotAction, IRobotTrigger } from '../../robot/interface';

export const checkIfModified = (remote: {
    trigger: IRobotTrigger,
    actions: IRobotAction[]
}, local: Map<string, IRobotTrigger | IRobotAction>) => {

  if (local.get(remote.trigger.triggerId)) {
    const isModifiedAction = !isEqualWith(remote.trigger.input, local.get(remote.trigger.triggerId), customizer);
    if (isModifiedAction) {
      return true;
    }
  }

  return remote.actions.some(action => {
    if (!local.get(action.actionId)) {
      return false;
    }
    return !isEqualWith(action.input, local.get(action.actionId), customizer);
  });

};
