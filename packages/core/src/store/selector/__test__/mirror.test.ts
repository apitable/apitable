import { Selectors } from 'store';
import { IReduxState } from 'store/interface';
import mirrorState from './mirror_state.json';
// 初始化数据
describe('镜像正常显示数据', () => {
  const state = mirrorState as any as IReduxState;

  it('The correlation data can be obtained normally in the mirror', () => {
    const snapshot = Selectors.getSnapshot(state, 'dst20W6iYZfeeGaVzu')!;
    const stringifyCellValue = Selectors.getStringifyCellValue(state, snapshot, 'recHwtmd2T99W', 'fldGZrNET2StU');
    expect(stringifyCellValue).toBe('可乐可乐');
  });
});