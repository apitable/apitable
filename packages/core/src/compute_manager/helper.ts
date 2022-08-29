import { IReduxState, Selectors } from 'store';
import { isServer } from 'utils/env';
import { computeCache } from './compute_cache_manager';
import { ComputeRefManager } from './compute_reference_manager';

export const COMPUTE_REF_MAP_CACHE_KEY = 'COMPUTE_REF_MAP_CACHE_KEY';
/**
 * 传入当前state，返回当前状态中的 计算字段的引用关系管理实例。
 */
export const getComputeRefManager = (state: IReduxState) => {
  const refMapCache = computeCache.get(COMPUTE_REF_MAP_CACHE_KEY);
  // 服务端没有更新 refMap 的机制，因此每次拿的都是最新的。不能从缓存里面取。
  if (refMapCache && !isServer()) {
    const computeRefManager = new ComputeRefManager(refMapCache.refMap, refMapCache.reRefMap);
    return computeRefManager;
  }
  const computeRefManager = new ComputeRefManager();
  Object.keys(state.datasheetMap).forEach(datasheetId => {
    const currSnapshot = Selectors.getSnapshot(state, datasheetId);
    const fieldMap = currSnapshot?.meta.fieldMap;
    if (fieldMap) {
      computeRefManager.computeRefMap(fieldMap, datasheetId, state);
    }
  });
  return computeRefManager;
};