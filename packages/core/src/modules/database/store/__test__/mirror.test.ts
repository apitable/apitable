import { Selectors } from '../../../../exports/store';
import { IReduxState } from '../../../../exports/store/interfaces';
import mirrorState from './mirror_state.json';

// init data
describe('mirror show data successfully', () => {
  const state = mirrorState as any as IReduxState;

  it('The correlation data can be obtained normally in the mirror', () => {
    const snapshot = Selectors.getSnapshot(state, 'dst20W6iYZfeeGaVzu')!;
    const stringifyCellValue = Selectors.getStringifyCellValue(state, snapshot, 'recHwtmd2T99W', 'fldGZrNET2StU');
    expect(stringifyCellValue).toBe('可乐可乐');
  });
});