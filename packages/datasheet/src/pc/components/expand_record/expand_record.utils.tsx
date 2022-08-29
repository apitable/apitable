import { expandRecordInner } from 'pc/components/expand_record/expand_record';
import { RecordType } from 'pc/components/expand_record/expand_record.enum';
import { IExpandRecordDatasheetProp, IExpandRecordIndependentProp } from 'pc/components/expand_record/expand_record.interface';
import { store } from 'pc/store';

/**
 * 暴露给外部调用，独立的卡片展开，且强制居中
 */
export const expandRecordInCenter = (props: IExpandRecordIndependentProp) => {
  expandRecordInner({ recordType: RecordType.Independent, ...props, forceCenter: true });
};

/**
 * 暴露给外部调用，独立的卡片展开
 */
export const expandRecord = (props: IExpandRecordIndependentProp) => {
  expandRecordInner({ recordType: RecordType.Independent, ...props });
};

/**
 * 路由方式触发展开卡片
 */
export const expandRecordRoute = (props?: IExpandRecordDatasheetProp) => {
  const state = store.getState();
  const { datasheetId, viewId, mirrorId } = state.pageParams;
  if (!datasheetId || !viewId) {
    console.warn('错误调用 expandRecordIdNavigate，路由参数不满足');
    return;
  }
  const commonProps = { datasheetId: mirrorId || datasheetId, viewId, recordIds: [], ...props };
  expandRecordInner({ recordType: RecordType.Datasheet, ...commonProps });
};
