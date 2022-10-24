import { dataSelfHelper } from '@apitable/core';
import { loadRecords } from 'pc/utils/load_records';
import { getDstNetworkData } from './helper';

(() => {
  if (!process.env.SSR) {
    (window as any).getDstNetworkData = getDstNetworkData;
  }
})();

export const fixData = (store) => {
  if (dataSelfHelper.needHelper) {
    // getCellValue 时候缺失的 cell 数据。dstId-fieldId-recordId[]
    const missKeys: string[] = [];
    dataSelfHelper.dataMap.forEach((recordIdSet, key) => {
      const [dstId] = key.split('-');
      try {
        const missRecordIds = Array.from(recordIdSet);
        missKeys.push(...missRecordIds.map(recordId => `${key}-${recordId}`));
        recordIdSet.size > 0 && loadRecords(dstId, Array.from(recordIdSet)).then(() => {
          // FIXME: 看看这里是否还需要刷新
          // Array.from(recordIdSet).forEach(recordId => {
          //   const signal = `${dstId}-${recordId}-${fieldId}`;
          //   // 通过依赖链，链式触发 op，情况依赖此字段/单元格的计算缓存。
          //   recomputeSignalSet.add(signal);
          // });
          // recomputeSignalSet.forEach(signal => {
          //   releaseComputeSignal(signal, state);
          // });
        });
      } catch (error) {
      }
    });
    dataSelfHelper.clear();

    // FIXME: 错误格式的 cellValue，也会出现这个问题。降低频率也没法减少上报的数据量。暂时取消报错。
    // FIXME: 只有少数自表关联的会出现这个问题，服务端修复后。这里应该不会进来。如果进来了需要上报错误。
    // 因为这个定时任务过于频繁。上报任务的频率需要降低。先统一存储起来
    // if (!state.pageParams.datasheetId) return;
    // const currentDatasheetMissingData = missingRecordDataMap.get(state.pageParams.datasheetId);
    // if (currentDatasheetMissingData) {
    //   missingRecordDataMap.set(state.pageParams.datasheetId, new Set([...missKeys, ...currentDatasheetMissingData]));
    // } else {
    //   missingRecordDataMap.set(state.pageParams.datasheetId, new Set(missKeys));
    // }
  }
  return;
};

