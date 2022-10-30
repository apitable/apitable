import { IReduxState, Selectors } from 'store';
import { isServer } from 'utils/env';
import { computeCache } from './compute_cache_manager';
import { ComputeRefManager } from './compute_reference_manager';

export const COMPUTE_REF_MAP_CACHE_KEY = 'COMPUTE_REF_MAP_CACHE_KEY';
/**
 * Pass in the current `state`, and return the reference relationship management instance of the computed field in the current state.
 */
export const getComputeRefManager = (state: IReduxState) => {
  const refMapCache = computeCache.get(COMPUTE_REF_MAP_CACHE_KEY);
  // The server does not have a mechanism to update the refMap, so every time it gets the latest one. cannot be retrieved from the cache.
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
