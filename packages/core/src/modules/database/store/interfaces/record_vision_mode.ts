import { SET_RECORD_VISION_MODE } from '../../../shared/store/action_constants';

export enum RecordVision {
  Center = 'center',
  Side = 'side'
}

export interface IRecordVisionAction {
  type: typeof SET_RECORD_VISION_MODE,
  payload: RecordVision;
}
