import { IJOTAction, jot } from 'engine';
import { IJOTActionPayload } from '../../../../../store/interfaces';

// TODO: delete here's any @kailang
export const JOTApply = <T extends { snapshot: any } = { snapshot: any }> (
  state: T,
  { payload }: IJOTActionPayload,
  filterCB?: (state: T, action: IJOTAction[]) => IJOTAction[]
): T => {
  const max = 10000;
  let pureJOTAction = payload.operations.reduce<IJOTAction[]>((pre, op) => {
    const length = op.actions.length;
    
    if (length > max) {
      for (let i = 0, divides = Math.ceil(length / max); i < divides; i++ ) {
        pre.push(...op.actions.slice(i * max , (i + 1)*max));
      }
    } else {
      pre.push(...op.actions);
    } 
    return pre;
  }, []);
  if (filterCB) {
    pureJOTAction = filterCB(state, pureJOTAction);
  }

  jot.apply(state.snapshot, pureJOTAction);
  return state;
};