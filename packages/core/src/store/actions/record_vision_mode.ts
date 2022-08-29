import { SET_RECORD_VISION_MODE } from 'store/action_constants';
import { RecordVision } from 'store/interface';

export const setRecordVision = (recordVision: RecordVision) => {
  return {
    type: SET_RECORD_VISION_MODE,
    payload: recordVision,
  };
};
