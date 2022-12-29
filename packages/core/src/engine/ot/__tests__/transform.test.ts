import { IJOTAction, jot, OTActionName } from '../';

describe('test jot transform', () => {
  it('test OR whit OI', () => {
    // const base = {
    //   array: [1, 2, 3, 4]
    // };
    const orAction = [{
      n: OTActionName.ObjectReplace,
      p: ['array'],
      oi: [3, 2, 4, 1],
      od: [1, 2, 3, 4]
    }] as IJOTAction[];

    const oiAction = [{
      n: OTActionName.ListInsert,
      p: ['array', 5],
      li: 1
    }] as IJOTAction[];

    const [leftOp, rightOp] = jot.transformX(orAction, oiAction);
    console.log(leftOp, rightOp);
  });
});
