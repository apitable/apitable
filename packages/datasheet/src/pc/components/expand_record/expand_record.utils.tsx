import { expandRecordInner } from 'pc/components/expand_record/expand_record';
import { RecordType } from 'pc/components/expand_record/expand_record.enum';
import { IExpandRecordDatasheetProp, IExpandRecordIndependentProp } from 'pc/components/expand_record/expand_record.interface';
import { store } from 'pc/store';

/**
 * Exposed to external calls, independent card expansion, and forced centering
 */
export const expandRecordInCenter = (props: IExpandRecordIndependentProp) => {
  expandRecordInner({ recordType: RecordType.Independent, ...props, forceCenter: true });
};

/**
 * Exposed to external calls, independent card unfolding
 */
export const expandRecord = (props: IExpandRecordIndependentProp) => {
  expandRecordInner({ recordType: RecordType.Independent, ...props });
};

/**
 * Routing method triggers the expansion of the card
 */
export const expandRecordRoute = (props?: IExpandRecordDatasheetProp) => {
  const state = store.getState();
  const { datasheetId, viewId, mirrorId } = state.pageParams;
  if (!datasheetId || !viewId) {
    console.warn('Error calling expandRecordIdNavigate, route parameter not satisfied');
    return;
  }
  const commonProps = { datasheetId: mirrorId || datasheetId, viewId, recordIds: [], ...props };
  expandRecordInner({ recordType: RecordType.Datasheet, ...commonProps });
};
