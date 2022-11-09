import { SET_RECORD_VISION_MODE } from '../../../shared/store/action_constants';
import { RecordVision } from '../../../../store/interfaces';

export const setRecordVision = (recordVision: RecordVision) => {
  return {
    type: SET_RECORD_VISION_MODE,
    payload: recordVision,
  };
};
