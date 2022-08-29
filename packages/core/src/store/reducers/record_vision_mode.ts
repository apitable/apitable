import { SET_RECORD_VISION_MODE } from 'store/action_constants';
import { IRecordVisionAction, RecordVision } from 'store/interface';
import produce from 'immer';

export const recordVision = produce((recordVisionModeDraft: RecordVision = RecordVision.Center, action: IRecordVisionAction) => {
  if (action.type === SET_RECORD_VISION_MODE) {
    recordVisionModeDraft = action.payload;
    return action.payload;
  }
  return recordVisionModeDraft;
});
