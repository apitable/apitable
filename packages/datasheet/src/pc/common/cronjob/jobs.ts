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
    // getCellValue The cell data missing at the time of the dstId-fieldId-recordId[].
    const missKeys: string[] = [];
    dataSelfHelper.dataMap.forEach((recordIdSet, key) => {
      const [dstId] = key.split('-');
      try {
        const missRecordIds = Array.from(recordIdSet);
        missKeys.push(...missRecordIds.map(recordId => `${key}-${recordId}`));
        recordIdSet.size > 0 && loadRecords(dstId, Array.from(recordIdSet)).then(() => {
          // FIXME: See if you still need a refresh here
          // Array.from(recordIdSet).forEach(recordId => {
          //   const signal = `${dstId}-${recordId}-${fieldId}`;
          //   // The situation depends on the calculation cache of this field/cell through the dependency chain, chain trigger op.
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
    /**
     * FIXME: The problem also occurs with incorrectly formatted cellValue. 
     * Reducing the frequency does not reduce the amount of data being reported. Eliminate error reporting for now.
     * FIXME: Only a few self-tabling associations will have this problem, after the server-side fix. 
     * It should not come in here. If it does come in it needs to be reported as an error.
     * Because this timed task is too frequent. The frequency of reporting tasks needs to be reduced. Store it uniformly first
     */
    // 
   
  }
  return;
};

