/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Purpose: advance calculation of information that needs to be processed based on the underlying metadata to be obtained
 * during UI rendering in the main thread, and caching it in the main thread
 */

import { AnyAction, Store } from 'redux';
import { BATCH, batchActions } from 'redux-batched-actions';
import { ActionConstants, CacheManager, DispatchToStore, IReduxState, Selectors, ViewType } from '@apitable/core';

import { computeService, TComputeDesc } from './compute';
import { ComputeServices } from './constants';

// interface IWrappedPromise {
//   abort: Function;
//   p: Promise<any>;
// }
// function wrapPromiseWithAbort(p: Promise<any>): IWrappedPromise {
//   const obj = {} as IWrappedPromise;
//   const p1 = new Promise(function(resolve, reject){
//     obj.abort = reject;
//   });
//   obj.p = Promise.race([p, p1]);
//   return obj;
// }
// let self;
let workerSelf: any;

(() => {
  if (!process.env.SSR) {
    workerSelf = self as unknown as Worker;

    // Listen to error fallback as a separate main thread calculation
    if ((workerSelf as any).name === 'store_worker') {
      workerSelf.addEventListener('error', (err: any) => {
        const errInfo = String(err);

        const resources = Object.keys(processingMap).filter((item) => item !== DEFAULT_NAMESPACE);
        const actions = resources.reduce((acc, id) => {
          acc.push(
            {
              type: ActionConstants.UPDATE_DATASHEET_COMPUTED,
              datasheetId: id,
              payload: {},
            },
            generateStatusAction(id, Business.Wide, false),
          );
          return acc;
        }, [] as AnyAction[]);
        postActionMessageToLocalStore(batchActions(actions));
        workerSelf.postMessage({ type: 'error_trace', errInfo });
      });
    }
  }
})();

const computeIds = new Map<string, number>();
const memoStatus = new Set<string>();
const requestFormLocalMap = new Map<string, number>();

// Temporarily do not break down each scene
enum Business {
  Wide = 'computing',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Search = 'computing', // 'searching',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Group = 'computing', // 'grouping',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Filter = 'computing', // 'filtering',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Sort = 'computing', // 'sorting'
}

// At this stage, the cache to be calculated is not broken down by scenario,
// as long as the action that will trigger the calculation comes in will all be calculated once
const allCompute = [
  ComputeServices.PureVisibleRows,
  // ComputeServices.VisibleColumns,
  ComputeServices.SearchResultArray,
  ComputeServices.LinearRows,
  ComputeServices.GroupBreakpoint,
];

interface IExecuteMeta {
  business: Business; // Indicates what business scenarios are handled
  computeDesc: TComputeDesc; // Describe which computing services are needed to process the current business
  preCompute?: () => AnyAction; // What you need to do before the calculation, send an action to the localStore, mark the start of the calculation
  afterCompute?: () => AnyAction; // Some additional things to handle after the calculation is complete
  useWorker?: boolean;
}

// interface IWrappedPromiseAndTimer extends IWrappedPromise {
//   timer?: NodeJS.Timeout
// }
interface IProcessingMap {
  [key: string]: {
    [key: string]: NodeJS.Timeout | undefined;
  };
}

// It is used to store the worker currently being computed, where the stored worker instances are classified according to the scenario,
// and a worker will generally compute multiple cached results
const processingMap: IProcessingMap = {};
const DEFAULT_NAMESPACE = 'DEFAULT_NAMESPACE';
let lastActiveRow: string | null = null;

const postActionMessageToLocalStore = (action: AnyAction) => {
  workerSelf.postMessage(
    JSON.stringify({
      action: { ...action, dispatchToStore: DispatchToStore.Local },
      postTime: Date.now(),
    }),
  );
};

const requestResourceFromLocalStore = (datasheetId: string) => {
  workerSelf.postMessage({ type: 'requestResource', datasheetId });
};

const generateStatusAction = (datasheetId: string, key: string, status: boolean) => {
  return { type: ActionConstants.SET_DATASHEET_COMPUTED_STATUS, datasheetId, payload: { [key]: status } };
};

const addComputeId = (datasheetId: string) => {
  const pre = computeIds.get(datasheetId) || 0;
  const next = pre + 1;
  computeIds.set(datasheetId, next);
  return next;
};

const getComputeId = (datasheetId: string) => {
  let res = computeIds.get(datasheetId);
  if (res == null) {
    res = 0;
    computeIds.set(datasheetId, res);
  }
  return res;
};

/**
 * The action map that needs to trigger the calculation
 * The computeDesc parameter indicates which cache results need to be computed
 */
export const TriggerComputeActions: { [key: string]: (action: AnyAction) => IExecuteMeta | null } = {
  [ActionConstants.DATASHEET_JOT_ACTION]: (action) => {
    return {
      business: Business.Wide,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Wide, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false),
    };
    // Only the first cmd is judged, and most of the grouping and sorting settings have only one cmd
    // const operations = action.payload?.operations || [];
    // const cmd = operations[0]?.cmd;
    // switch (cmd) {
    // case CollaCommandName.SetGroup:
    //   return {
    //     business: Business.Group,
    //     computeDesc: allCompute,
    //     preCompute: () => generateStatusAction(action.datasheetId, Business.Group, true),
    //     afterCompute: () => generateStatusAction(action.datasheetId, Business.Group, false),
    //   };
    // case CollaCommandName.SetViewFilter:
    //   return {
    //     business: Business.Filter,
    //     computeDesc: allCompute,
    //     preCompute: () => generateStatusAction(action.datasheetId, Business.Filter, true),
    //     afterCompute: () => generateStatusAction(action.datasheetId, Business.Filter, false),
    //   };
    // case CollaCommandName.SetSortInfo:
    //   return {
    //     business: Business.Sort,
    //     computeDesc: allCompute,
    //     preCompute: () => generateStatusAction(action.datasheetId, Business.Sort, true),
    //     afterCompute: () => generateStatusAction(action.datasheetId, Business.Sort, false),
    //   };
    // case CollaCommandName.SystemSetRecords:
    //   return null;

    //   default:
    //     return {
    //       business: Business.Wide,
    //       computeDesc: allCompute,
    //       preCompute: () => generateStatusAction(action.datasheetId, Business.Wide, true),
    //       afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false),
    //     };
    // }
  },
  [ActionConstants.DATAPACK_LOADED]: (action) => {
    return {
      business: Business.Wide,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Wide, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false),
    };
  },
  [ActionConstants.SET_SEARCH_KEYWORD]: (action) => {
    return {
      business: Business.Search,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Search, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Search, false),
    };
  },
  [ActionConstants.SET_GROUPING_COLLAPSE]: (action) => {
    return {
      business: Business.Group,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Group, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Group, false),
    };
  },
  [ActionConstants.SET_ACTIVE_ROW_INFO]: (action) => {
    const { fieldId, recordId } = action.payload.positionInfo;
    const next = `${fieldId}-${recordId}`;
    if (lastActiveRow === next) {
      return null;
    }
    lastActiveRow = next;
    return {
      business: Business.Wide,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Wide, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false),
    };
  },
  [ActionConstants.CLEAR_ACTIVE_ROW_INFO]: (action) => {
    if (!lastActiveRow) {
      return null;
    }
    lastActiveRow = null;
    return {
      business: Business.Wide,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Wide, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false),
    };
  },
  [ActionConstants.UPDATE_SNAPSHOT]: (action) => {
    return {
      business: Business.Wide,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Wide, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false),
    };
  },
};

const abortProcessing = (namespace: string, business: Business) => {
  const processing = processingMap[namespace] && processingMap[namespace][business];
  memoStatus.delete(`${namespace}_${business}`);
  if (processing) {
    clearTimeout(processing as NodeJS.Timeout);
  }
};

const addProcessing = (computeMeta: IExecuteMeta, state: IReduxState, datasheetId: string, callback: (params: any) => any) => {
  // Turning on a subworker to compute separately is not worth the effort
  // when the amount of data is relatively small (transfer time > computation time).
  // TODO: Solve the initialization problem when subworkers have different domains.
  // TODO: Automatically switch whether to use sub-workers for computation based on the result of computation time consumption
  const { business, computeDesc } = computeMeta;
  const curComputeId = addComputeId(datasheetId);
  const timer = setTimeout(() => {
    const resourceId = datasheetId !== DEFAULT_NAMESPACE ? datasheetId : undefined;
    const result = computeService(state, computeDesc, curComputeId, resourceId);
    processingMap[datasheetId] = { ...processingMap[datasheetId], [business]: undefined };
    setTimeout(() => {
      if (result.computeId === getComputeId(datasheetId)) {
        callback(result.data);
      }
    });
  }, 0);
  processingMap[datasheetId] = { ...processingMap[datasheetId], [business]: timer };
};

// Check if the current action needs to trigger a computation, and if so, re-instantiate a compute_worker to start the computation
const executeComputeIfNeed = (action: AnyAction, state: IReduxState) => {
  if (action.type === BATCH && Array.isArray(action.payload)) {
    action.payload.forEach((batchAction: AnyAction) => {
      executeComputeIfNeed(batchAction, state);
    });
  } else {
    const getComputeMeta = TriggerComputeActions[action.type as string];
    const activeView = Selectors.getCurrentView(state);
    if (!activeView || activeView.type === ViewType.Kanban) {
      return;
    }

    if (getComputeMeta) {
      const resource = Selectors.getDatasheet(state, action.datasheetId);
      if (!resource) {
        if (!requestFormLocalMap.has(action.datasheetId)) {
          requestResourceFromLocalStore(action.datasheetId);
          requestFormLocalMap.set(action.datasheetId, 1);
        }
        return;
      }
      requestFormLocalMap.delete(action.datasheetId);
      const computeMeta = getComputeMeta(action);
      if (!computeMeta) {
        return;
      }
      const { business, preCompute, afterCompute } = computeMeta;
      const namespace = action.datasheetId || DEFAULT_NAMESPACE;
      const memoStatusKey = `${namespace}_${business}`;
      if (processingMap[namespace] && processingMap[namespace][business]) {
        abortProcessing(namespace, business);
      }
      if (preCompute && !memoStatus.has(memoStatusKey)) {
        memoStatus.add(memoStatusKey);
        postActionMessageToLocalStore(preCompute());
      }
      addProcessing(computeMeta, state, namespace, (data) => {
        let postAction: AnyAction = {
          type: ActionConstants.UPDATE_DATASHEET_COMPUTED,
          datasheetId: action.datasheetId,
          payload: data,
        };
        if (afterCompute) {
          postAction = batchActions([postAction, afterCompute()]);
        }
        if (memoStatus.has(memoStatusKey)) {
          memoStatus.delete(memoStatusKey);
        }
        postActionMessageToLocalStore(postAction);
      });
    }
  }
};

export const withCompute = (store: Store<Partial<IReduxState>>) => {
  if (!process.env.SSR && !(workerSelf as any).document) {
    (workerSelf as any).useWorkerCompute = true;
  }
  const originDispatch = store.dispatch;
  let lastAction: string | null = null;

  const removeCache = ([dsId, fieldId, recordId, nextCache]: any) => {
    if (nextCache) {
      CacheManager.setCellCache(dsId, fieldId, recordId, nextCache);
    } else if (!fieldId) {
      CacheManager.removeCellCacheByRecord(dsId, recordId);
    } else {
      CacheManager.removeCellCache(dsId, fieldId, recordId);
    }

    if (lastAction === ActionConstants.DATASHEET_JOT_ACTION) {
      lastAction = null;
      originDispatch({ type: ActionConstants.REFRESH_SNAPSHOT, datasheetId: dsId });
      const state = store.getState();
      executeComputeIfNeed({ type: ActionConstants.UPDATE_SNAPSHOT, datasheetId: dsId }, state as IReduxState);
    }
  };

  store.dispatch = (action: any) => {
    const retValue = originDispatch(action);
    lastAction = action.type;
    const state = store.getState();
    executeComputeIfNeed(action, state as IReduxState);
    return retValue;
  };

  return {
    ...store,
    removeCache,
  };
};
