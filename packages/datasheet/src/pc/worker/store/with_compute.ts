/**
 * 用途：用来提前计算在主线程UI渲染的过程中需要根据基础元数据加工才能得到的信息，将其缓存到主线程
 */

import { ActionConstants, CacheManager, DispatchToStore, IReduxState, Selectors, ViewType } from '@apitable/core';
import { AnyAction, Store } from 'redux';
import { BATCH, batchActions } from 'redux-batched-actions';

import { computeService, TComputeDesc } from './compute';
import { ComputeServices } from './constants';

// interface IWrappedPromise {
//   abort: Function;
//   p: Promise<any>;
// }
// function wrapPromiseWithAbort(p: Promise<any>): IWrappedPromise {
//   const obj = {} as IWrappedPromise;
//   //内部定一个新的promise，用来终止执行
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

    // 监听到错误回退为单独主线程计算
    if ((workerSelf as any).name === 'store_worker') {
      workerSelf.addEventListener('error', (err: any) => {
        const errInfo = String(err);

        const resources = Object.keys(processingMap).filter(item => item !== DEFAULT_NAMESPACE);
        const actions = resources.reduce((acc, id) => {
          acc.push({
            type: ActionConstants.UPDATE_DATASHEET_COMPUTED,
            datasheetId: id,
            payload: {}
          }, generateStatusAction(id, Business.Wide, false));
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

// 暂时不细分每个场景
enum Business {
  Wide = 'computing',
  Search = 'computing', // 'searching',
  Group = 'computing', // 'grouping',
  Filter = 'computing', // 'filtering',
  Sort = 'computing', // 'sorting'
}

// 现阶段不按场景细分要计算的缓存，只要会触发计算的action进来都会全部计算一次
const allCompute = [
  ComputeServices.PureVisibleRows,
  // ComputeServices.VisibleColumns,
  ComputeServices.SearchResultArray,
  ComputeServices.LinearRows,
  ComputeServices.GroupBreakpoint
];

interface IExecuteMeta {
  business: Business; // 表示处理什么业务场景
  computeDesc: TComputeDesc; // 描述处理当前业务需要用到哪些计算服务
  preCompute?: () => AnyAction; // 计算前需要做的事，一般发送一个action到localStore,标记开始计算
  afterCompute?: () => AnyAction; // 计算完成后，需要额外处理的一些事情
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

// 用来存储当前正在计算的worker，这里存储的worker实例是根据场景分类的，一个worker一般会计算多个缓存结果
const processingMap: IProcessingMap = {};
const DEFAULT_NAMESPACE = 'DEFAULT_NAMESPACE';
let lastActiveRow: string | null = null;

const postActionMessageToLocalStore = (action: AnyAction) => {
  workerSelf.postMessage(JSON.stringify({
    action: { ...action, dispatchToStore: DispatchToStore.Local },
    postTime: Date.now()
  }));
};

const requestResourceFromLocalStore = (datasheetId: string) => {
  workerSelf.postMessage({ type: 'requestResource', datasheetId });
};

const generateStatusAction = (datasheetId: string, key: string, status: boolean) => {
  return { type: ActionConstants.SET_DATASHEET_COMPUTED_STATUS, datasheetId, payload: { [key]: status }};
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

/** 需要触发计算的action Map
 * computeDesc 参数表明需要计算哪些缓存结果
 */
export const TriggerComputeActions: { [key: string]: (action: AnyAction) => IExecuteMeta | null } = {
  [ActionConstants.DATASHEET_JOT_ACTION]: (action) => {
    return {
      business: Business.Wide,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Wide, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false),
    };
    // 仅判断第一个cmd，大部分的分组、排序设置也只有一个cmd
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
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Search, false)
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
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false)
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
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false)
    };
  },
  [ActionConstants.UPDATE_SNAPSHOT]: (action) => {
    return {
      business: Business.Wide,
      computeDesc: allCompute,
      preCompute: () => generateStatusAction(action.datasheetId, Business.Wide, true),
      afterCompute: () => generateStatusAction(action.datasheetId, Business.Wide, false)
    };
  }
};

const abortProcessing = (namespace: string, business: Business) => {
  const processing = processingMap[namespace] && processingMap[namespace][business];
  memoStatus.delete(`${namespace}_${business}`);
  if (processing) {
    clearTimeout(processing as NodeJS.Timeout);
  }
};

const addProcessing = (computeMeta: IExecuteMeta, state: IReduxState, datasheetId: string, callback: (params: any) => any) => {
  // 开启子worker来单独计算在数据量比较小的情况下（传输耗时>计算耗时）得不偿失。
  // TO DO: 解决子worker不同域时初始化问题。
  // TO DO: 根据计算耗时结果自动切换是否用子worker进行计算
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

// 检查当前action是否需要触发计算，如果需要计算则重新实例化一个compute_worker开始计算
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
          payload: data
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
    removeCache
  };
};
