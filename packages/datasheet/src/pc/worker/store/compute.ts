import { Selectors, IReduxState } from '@apitable/core';

import { ComputeServices } from './constants';

export const computeServiceSet: { [key: string]: (state: IReduxState, resourceId?: string) => any } = {
  [ComputeServices.PureVisibleRows]: (state, resourceId) => Selectors.getPureVisibleRows(state, resourceId),
  [ComputeServices.VisibleColumns]: (state, resourceId) => Selectors.getVisibleColumns(state, resourceId),
  [ComputeServices.SearchResultArray]: (state) => Selectors.getSearchResultArray(state, Selectors.getSearchKeyword(state) || ''),
  [ComputeServices.LinearRows]: (state) => Selectors.getLinearRows(state),
  [ComputeServices.GroupBreakpoint]: (state) => Selectors.getGroupBreakpoint(state),
};

// Describe what information is to be returned by the calculation
export declare type TComputeDesc = ComputeServices[];

export const computeService = (state: IReduxState, computeDesc: TComputeDesc, id: number, resourceId?: string) => {
  const result = computeDesc.reduce((res, key: string) => {
    res[key] = computeServiceSet[key] ? computeServiceSet[key](state, resourceId) : undefined;
    return res;
  }, {} as any);

  return { data: result, computeId: id };
};

