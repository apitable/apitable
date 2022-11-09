import { CURSOR_MOVE, DATASHEET_ACTIVE_COLLABORATOR, DATASHEET_DEACTIVATE_COLLABORATOR } from '../../../../../shared/store/action_constants';
import { ICursorMove, ICollaborator } from '../../../../../../exports/store/interfaces';

export const activeDatasheetCollaborator = (payload: ICollaborator, resourceId: string) => {
  return {
    type: DATASHEET_ACTIVE_COLLABORATOR,
    datasheetId: resourceId,
    payload,
  };
};

export const deactivateDatasheetCollaborator = (payload: { socketId: string }, resourceId: string) => {
  return {
    type: DATASHEET_DEACTIVATE_COLLABORATOR,
    datasheetId: resourceId,
    payload,
  };
};

export const cursorMove = (
  payload: {
    socketId: string;
    fieldId: string,
    recordId: string,
    time: number
  },
  datasheetId: string,
): ICursorMove => {
  return {
    type: CURSOR_MOVE,
    datasheetId,
    payload,
  };
};
