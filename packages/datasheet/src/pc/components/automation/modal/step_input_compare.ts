import { isEqual } from 'lodash';
import { IRobotAction, IRobotTrigger } from '../../robot/interface';

export const checkIfModified = (remote: {
    trigger: IRobotTrigger,
    actions: IRobotAction[]
}, local: Map<string, IRobotTrigger | IRobotAction>) => {

  if (local.get(remote.trigger.triggerId)) {
    const isModifiedAction = !isEqual(remote.trigger.input, local.get(remote.trigger.triggerId));
    if (isModifiedAction) {
      return true;
    }
  }

  return remote.actions.some(action => {
    if (!local.get(action.actionId)) {
      return false;
    }
    return !isEqual(action.input, local.get(action.actionId));
  });

};
